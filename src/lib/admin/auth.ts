"use server";

import { createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "ct_admin";
const SEVEN_DAYS = 60 * 60 * 24 * 7;
const DEFAULT_ADMIN_SECRET = "ct-admin-default-salt-v1";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();

function adminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to .env.local — pick a strong value, anything you want.",
    );
  }
  return p;
}

function adminSecret(): string {
  return process.env.ADMIN_SECRET ?? DEFAULT_ADMIN_SECRET;
}

function adminToken(): string {
  return createHmac("sha256", adminSecret()).update(adminPassword()).digest("hex");
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return h.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ip, { attempts: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.attempts >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.attempts += 1;
  return true;
}

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await getClientIp();
  if (!checkRateLimit(ip)) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }
  const password = formData.get("password")?.toString() ?? "";
  if (password !== adminPassword()) {
    return { error: "Wrong password." };
  }
  const store = await cookies();
  store.set(COOKIE_NAME, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie) return false;
  return cookie.value === adminToken();
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
