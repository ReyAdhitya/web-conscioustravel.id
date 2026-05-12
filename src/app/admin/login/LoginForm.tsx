"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { loginAction, type LoginState } from "@/lib/admin/auth";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-6">
      <label htmlFor="password" className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs tracking-wide">Password</span>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={`bg-background text-foreground rounded-lg border px-3 py-2 text-sm focus:outline-none ${
            state.error ? "border-destructive focus:border-destructive" : "border-border focus:border-accent"
          }`}
        />
        {state.error && <span className="text-destructive text-xs">{state.error}</span>}
      </label>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-10 rounded-full text-sm tracking-wide"
      >
        {pending ? "Checking…" : "Sign in"}
      </Button>
    </form>
  );
}
