import type { Metadata } from "next";
import { InquiryForm } from "./InquiryForm";

export const metadata: Metadata = {
  title: "Plan a custom journey",
  description:
    "Tell us how you want to travel — dates, group, interests, budget — and we'll craft a custom Indonesian itinerary for you.",
  openGraph: {
    title: "Plan a custom journey — Conscious Travel Indonesia",
    description:
      "Tell us how you want to travel — dates, group, interests, budget — and we'll craft a custom Indonesian itinerary for you.",
    type: "website",
  },
};

export default function InquiryPage() {
  return (
    <>
      <section className="border-border/50 bg-background border-b px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">
            Custom journey
          </p>
          <h1 className="text-foreground font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Tell us how you want to <span className="text-accent italic">travel</span>.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            We design custom journeys around how you actually want to spend your time. Send us the
            shape of your trip — dates, group, interests, rough budget — and we&apos;ll come back
            within two business days with a curated proposal.
          </p>
        </div>
      </section>

      <section className="bg-background px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
