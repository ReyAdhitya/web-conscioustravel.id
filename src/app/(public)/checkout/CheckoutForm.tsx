"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitCheckout, type CheckoutFormState } from "@/lib/bookings/actions";

const initial: CheckoutFormState = {};

export function CheckoutForm({ tourSlug }: { tourSlug: string }) {
  const [state, formAction, pending] = useActionState(submitCheckout, initial);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="tourSlug" value={tourSlug} />

      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Contact details
        </legend>

        <Field
          label="Full name"
          name="contactName"
          autoComplete="name"
          required
          error={state.errors?.contactName}
        />
        <Field
          label="Email"
          name="contactEmail"
          type="email"
          autoComplete="email"
          required
          error={state.errors?.contactEmail}
        />
        <Field
          label="Phone (with country code)"
          name="contactPhone"
          type="tel"
          autoComplete="tel"
          required
          error={state.errors?.contactPhone}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <label
          htmlFor="notes"
          className="text-xs tracking-[0.2em] uppercase text-muted-foreground"
        >
          Anything we should know? (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
          placeholder="Dietary needs, mobility considerations, special requests…"
        />
      </fieldset>

      {state.message && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-4 h-12 self-start rounded-full px-8 text-sm tracking-wide"
      >
        {pending ? "Submitting…" : "Confirm booking"}
      </Button>

      <p className="text-[11px] text-muted-foreground">
        By submitting you agree to our booking terms. You won&apos;t be charged yet — payment
        instructions arrive by email.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
      <span className="text-xs tracking-wide text-muted-foreground">{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none ${
          error
            ? "border-destructive focus:border-destructive"
            : "border-border focus:border-accent"
        }`}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
