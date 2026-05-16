"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { submitCheckout, type CheckoutFormState } from "@/lib/bookings/actions";
import { formatPrice } from "@/lib/format";
import type { Departure } from "@/lib/db/schema";

const initial: CheckoutFormState = {};

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDateRange(startsOn: string, endsOn: string): string {
  const start = fmt.format(new Date(startsOn + "T00:00:00"));
  const end = fmt.format(new Date(endsOn + "T00:00:00"));
  return `${start} – ${end}`;
}

export function CheckoutForm({
  tourSlug,
  tourKind,
  departures,
}: {
  tourSlug: string;
  tourKind: "fixed" | "open";
  departures: Departure[];
}) {
  const [state, formAction, pending] = useActionState(submitCheckout, initial);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>("");

  const isFixed = tourKind === "fixed" && departures.length > 0;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="tourSlug" value={tourSlug} />

      {isFixed && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Choose your departure date{" "}
            <span className="normal-case tracking-normal text-destructive">*</span>
          </legend>
          <input type="hidden" name="departureId" value={selectedDepartureId} />
          <div className="flex flex-col gap-3">
            {departures.map((dep) => {
              const soldOut = dep.status === "sold_out";
              const spotsLeft = dep.capacity - dep.bookedCount;
              const selected = selectedDepartureId === dep.id;
              return (
                <label
                  key={dep.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    soldOut
                      ? "cursor-not-allowed border-border/40 bg-muted/30 opacity-60"
                      : selected
                        ? "border-2 border-accent bg-accent/5"
                        : "border border-border/60 bg-card hover:border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="_departureRadio"
                    value={dep.id}
                    disabled={soldOut}
                    checked={selected}
                    onChange={() => setSelectedDepartureId(dep.id)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-accent bg-accent" : "border-border/60 bg-background"
                    }`}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </span>
                  <span className="flex flex-col gap-0.5 text-sm">
                    <span className="font-medium text-foreground">
                      {formatDateRange(dep.startsOn, dep.endsOn)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dep.priceOverrideMinor != null
                        ? formatPrice(dep.priceOverrideMinor, "IDR")
                        : null}
                      {dep.bookedCount > 0 && !soldOut && (
                        <> · {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left</>
                      )}
                      {soldOut && <> · Sold out</>}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {state.errors?.departureId && (
            <span className="text-xs text-destructive">{state.errors.departureId}</span>
          )}
        </fieldset>
      )}

      {!isFixed && tourKind === "open" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Your travel dates (optional)
          </legend>
          <p className="text-xs text-muted-foreground">
            We&apos;ll confirm availability within 24 hours.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="arrivalDate" className="flex flex-col gap-1.5">
              <span className="text-xs tracking-wide text-muted-foreground">Arrival date</span>
              <input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>
            <label htmlFor="departureDate" className="flex flex-col gap-1.5">
              <span className="text-xs tracking-wide text-muted-foreground">Departure date</span>
              <input
                id="departureDate"
                name="departureDate"
                type="date"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              />
            </label>
          </div>
        </fieldset>
      )}

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
