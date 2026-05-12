"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "ct_admin";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

function adminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to .env.local — pick a strong value, anything you want.",
    );
  }
  return p;
}

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password")?.toString() ?? "";
  if (password !== adminPassword()) {
    return { error: "Wrong password." };
  }
  const store = await cookies();
  store.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
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
  return cookie.value === adminPassword();
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
