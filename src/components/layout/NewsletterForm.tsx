"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribeToNewsletter, type NewsletterFormState } from "@/lib/newsletter/actions";

const initial: NewsletterFormState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeToNewsletter, initial);

  return (
    <div>
      <p className="text-ink-soft mb-3.5 text-sm">Letters from the road, every other Sunday.</p>
      <form
        action={action}
        className={`bg-card flex items-center rounded-full py-2 pr-2 pl-[22px] transition-colors ${
          state.status === "error" ? "ring-destructive/40 ring-2" : ""
        }`}
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          aria-label="Email address"
          className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent py-3 text-sm outline-none"
          disabled={pending || state.status === "success"}
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={pending || state.status === "success"}
          className="bg-accent-deep text-background hover:bg-accent grid size-[42px] place-items-center rounded-full transition disabled:opacity-60"
        >
          {state.status === "success" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </form>
      {state.message && (
        <p
          className={`mt-2.5 text-xs ${
            state.status === "success" ? "text-accent" : "text-destructive"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
