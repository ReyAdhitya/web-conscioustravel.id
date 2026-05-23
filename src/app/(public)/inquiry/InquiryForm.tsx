"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitInquiry, type InquiryFormState } from "@/lib/inquiries/actions";

const initial: InquiryFormState = {};

const interestOptions = [
  "Wellness & yoga",
  "Eco / nature",
  "Cultural immersion",
  "Adventure",
  "Food & cooking",
  "Photography",
  "Diving / snorkeling",
  "Slow travel",
];

const destinationOptions = [
  "Bali",
  "Java",
  "Lombok",
  "Sumba",
  "Flores",
  "Komodo",
  "Raja Ampat",
  "Sumatra",
  "Open to suggestions",
];

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const hasErrors = Boolean(state.errors && Object.keys(state.errors).length > 0);

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
    <form ref={formRef} action={formAction} className="flex flex-col gap-12">
      {state.message && (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-sm"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">{state.message}</p>
            {hasErrors && (
              <ul className="mt-1.5 list-inside list-disc text-[13px] opacity-90">
                {Object.entries(state.errors ?? {}).map(([key, msg]) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <Section title="About you">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="contactName" required error={state.errors?.contactName} autoComplete="name" />
          <Field label="Email" name="contactEmail" type="email" required error={state.errors?.contactEmail} autoComplete="email" />
        </div>
        <Field label="Phone (with country code)" name="contactPhone" type="tel" required error={state.errors?.contactPhone} autoComplete="tel" />
      </Section>

      <Section title="Your trip">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Approx. start date" name="travelStart" type="date" />
          <Field label="Approx. end date" name="travelEnd" type="date" />
          <Field label="Travelers" name="groupSize" type="number" min={1} max={50} defaultValue={2} />
        </div>
        <p className="text-xs text-muted-foreground">Dates are flexible. Leave empty if you&apos;re still deciding.</p>
      </Section>

      <Section title="Style of journey">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground mb-3">
            Interests <span className="text-muted-foreground/60">(pick any that apply)</span>
          </p>
          <CheckGroup name="interests" options={interestOptions} />
        </div>
        <div>
          <p className="text-xs tracking-wide text-muted-foreground mb-3">
            Destinations <span className="text-muted-foreground/60">(pick any you&apos;re drawn to)</span>
          </p>
          <CheckGroup name="destinations" options={destinationOptions} />
        </div>
      </Section>

      <Section title="Budget" subtitle="Optional. Gives us a sensible starting point.">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-wide text-muted-foreground">Currency</span>
            <select
              name="budgetCurrency"
              defaultValue=""
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              <option value="">Select currency</option>
              <option value="IDR">IDR (Rp)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
          <Field label="Min per person" name="budgetMin" type="number" min={0} step={100} placeholder="e.g. 5000000" />
          <Field label="Max per person" name="budgetMax" type="number" min={0} step={100} placeholder="e.g. 15000000" />
        </div>
      </Section>

      <Section title="Tell us more" subtitle="What does the trip you're imagining look like?">
        <label className="flex flex-col gap-1.5">
          <textarea
            name="message"
            rows={6}
            required
            minLength={20}
            maxLength={4000}
            className={`rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none ${state.errors?.message ? "border-destructive focus:border-destructive" : "border-border focus:border-accent"}`}
            placeholder="Honeymoon, family trip with two kids 8 and 12, slower pace, mostly Bali plus a few nights somewhere quieter…"
          />
          {state.errors?.message && (
            <span className="text-xs text-destructive">{state.errors.message}</span>
          )}
        </label>
      </Section>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={pending}
          className="h-12 self-start rounded-full px-8 text-sm tracking-wide"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          We respond within two business days. No card needed. Quoting is free and no-obligation.
        </p>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <div>
        <legend className="font-serif text-xl tracking-tight text-foreground">{title}</legend>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  placeholder,
  min,
  max,
  step,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
}) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5">
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`rounded-lg bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none ${
          error
            ? "border-2 border-destructive bg-destructive/5 focus:border-destructive"
            : "border border-border focus:border-accent"
        }`}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs font-medium text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

function CheckGroup({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs tracking-wide text-muted-foreground transition has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent hover:border-accent/40 hover:text-foreground"
        >
          <input type="checkbox" name={name} value={opt} className="sr-only" />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
