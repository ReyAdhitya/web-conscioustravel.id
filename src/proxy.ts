import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: This is the Next.js 16 "Proxy" file convention (formerly `middleware.ts`).
// It runs on the Node.js runtime by default and protects every path matched by
// the `config.matcher` below. We deliberately re-implement the small HMAC token
// logic here — `src/lib/admin/auth.ts` is a "use server" module that imports
// `next/headers`, neither of which is available inside a Proxy.

const COOKIE_NAME = "ct_admin";
const LOGIN_PATH = "/admin/login";
// Must stay in sync with `adminSecret()` in src/lib/admin/auth.ts — the login
// action signs the cookie with this key, and this proxy verifies it. If the two
// disagree, every valid login bounces straight back to /admin/login.
const DEFAULT_ADMIN_SECRET = "ct-admin-default-salt-v1";

function computeAdminToken(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? DEFAULT_ADMIN_SECRET;
  return createHmac("sha256", secret).update(password).digest("hex");
}

function tokensMatch(expected: string, actual: string): boolean {
  // Both values are hex digests of equal length, but guard against mismatches
  // to avoid `timingSafeEqual` throwing on different buffer sizes.
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(actual, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Always let the login page (and its server action POST) through, otherwise
  // unauthenticated users could never reach the form to sign in.
  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // Fail closed: if the password isn't configured, no one is authenticated.
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const expected = computeAdminToken(password);
  if (!tokensMatch(expected, cookie.value)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
