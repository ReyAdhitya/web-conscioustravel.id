"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
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
  const formRef = useRef<HTMLFormElement>(null);

  const isFixed = tourKind === "fixed" && departures.length > 0;
  const isFixedButEmpty = tourKind === "fixed" && departures.length === 0;
  const hasErrors = Boolean(state.errors && Object.keys(state.errors).length > 0);

  // After a failed submission, scroll the banner into view and focus the first
  // invalid field so users immediately see what to fix.
  useEffect(() => {
    if (!hasErrors || !formRef.current) return;
    const firstErrorKey = state.errors && Object.keys(state.errors)[0];
    if (!firstErrorKey) return;
    const el = formRef.current.querySelector<HTMLElement>(`[name="${firstErrorKey}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }
  }, [state, hasErrors]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="tourSlug" value={tourSlug} />

      {state.message && (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-3 rounded-xl border-2 px-4 py-4 text-sm"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">{state.message}</p>
            {hasErrors && (
              <ul className="mt-2 list-inside list-disc text-[13px] opacity-90">
                {Object.entries(state.errors ?? {}).map(([key, msg]) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {isFixedButEmpty && (
        <div
          role="alert"
          className="border-border bg-card flex flex-col gap-2 rounded-xl border-2 border-dashed px-5 py-5"
        >
          <p className="text-foreground font-serif text-lg tracking-[-0.005em]">
            No scheduled departures yet.
          </p>
          <p className="text-ink-soft text-sm leading-[1.6]">
            This journey runs on fixed dates and none are currently published. Send a quick inquiry
            and we&apos;ll come back with the next available group within two business days.
          </p>
          <a
            href={`/inquiry?tour=${tourSlug}`}
            className="bg-accent-deep text-background hover:bg-accent mt-2 inline-flex h-11 w-fit items-center rounded-full px-6 text-sm font-medium transition-colors"
          >
            Request custom dates
          </a>
        </div>
      )}

      {isFixed && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Choose your departure date{" "}
            <span className="text-destructive tracking-normal normal-case">*</span>
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
                  className={`has-[:focus-visible]:outline-accent flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                    soldOut
                      ? "border-border/40 bg-muted/30 cursor-not-allowed opacity-60"
                      : selected
                        ? "border-accent bg-accent/5"
                        : "border-border/60 bg-card hover:border-border"
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
                    {selected && <span className="bg-background h-1.5 w-1.5 rounded-full" />}
                  </span>
                  <span className="flex flex-col gap-0.5 text-sm">
                    <span className="text-foreground font-medium">
                      {formatDateRange(dep.startsOn, dep.endsOn)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {dep.priceOverrideMinor != null
                        ? formatPrice(dep.priceOverrideMinor, "IDR")
                        : null}
                      {dep.bookedCount > 0 && !soldOut && (
                        <>
                          {" "}
                          · {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                        </>
                      )}
                      {soldOut && <> · Sold out</>}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {state.errors?.departureId && (
            <span className="text-destructive text-xs">{state.errors.departureId}</span>
          )}
        </fieldset>
      )}

      {!isFixed && tourKind === "open" && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            Your travel dates (optional)
          </legend>
          <p className="text-muted-foreground text-xs">
            We&apos;ll confirm availability within 24 hours.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="arrivalDate" className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs tracking-wide">Arrival date</span>
              <input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                className="border-border bg-background text-foreground focus:border-accent rounded-lg border px-3 py-2.5 text-sm focus:outline-none"
              />
            </label>
            <label htmlFor="departureDate" className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs tracking-wide">Departure date</span>
              <input
                id="departureDate"
                name="departureDate"
                type="date"
                className="border-border bg-background text-foreground focus:border-accent rounded-lg border px-3 py-2.5 text-sm focus:outline-none"
              />
            </label>
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-2">
        <label
          htmlFor="paxCount"
          className={`text-xs tracking-wide ${state.errors?.paxCount ? "text-destructive font-medium" : "text-muted-foreground"}`}
        >
          Number of travellers
          <span aria-hidden> *</span>
        </label>
        <input
          id="paxCount"
          name="paxCount"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          required
          aria-invalid={state.errors?.paxCount ? "true" : undefined}
          aria-describedby={state.errors?.paxCount ? "paxCount-error" : undefined}
          className={`bg-background text-foreground w-32 rounded-lg px-3 py-2.5 text-sm focus:outline-none ${
            state.errors?.paxCount
              ? "border-destructive bg-destructive/5 focus:border-destructive border-2"
              : "border-border focus:border-accent border"
          }`}
        />
        {state.errors?.paxCount && (
          <span id="paxCount-error" className="text-destructive text-xs font-medium">
            {state.errors.paxCount}
          </span>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
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
        <label htmlFor="notes" className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          Anything we should know? (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-accent rounded-lg border px-3 py-2.5 text-sm focus:outline-none"
          placeholder="Dietary needs, mobility considerations, special requests…"
        />
      </fieldset>

      <Button
        type="submit"
        disabled={pending || isFixedButEmpty}
        className="hover:bg-accent mt-4 h-12 self-start rounded-full px-8 text-sm tracking-wide"
      >
        {pending ? "Submitting…" : "Confirm booking"}
      </Button>
      {isFixedButEmpty && (
        <p className="text-muted-foreground -mt-1 text-[12px]">
          Booking is disabled until a departure is scheduled. Use the inquiry link above.
        </p>
      )}

      <p className="text-muted-foreground text-[11px]">
        By submitting you agree to our booking terms. You won&apos;t be charged yet. Payment
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
    <label htmlFor={name} className="flex flex-col gap-2">
      <span
        className={`text-xs tracking-wide ${error ? "text-destructive font-medium" : "text-muted-foreground"}`}
      >
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`bg-background text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none ${
          error
            ? "border-destructive bg-destructive/5 focus:border-destructive border-2"
            : "border-border focus:border-accent border"
        }`}
      />
      {error && (
        <span id={`${name}-error`} className="text-destructive text-xs font-medium">
          {error}
        </span>
      )}
    </label>
  );
}
