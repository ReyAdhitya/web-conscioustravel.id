import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTourBySlug } from "@/lib/content/tours";
import { formatPrice } from "@/lib/format";
import { getUpcomingDeparturesByTourId } from "@/lib/departures/store";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour: tourSlug } = await searchParams;

  if (!tourSlug) {
    return (
      <section className="bg-background px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl tracking-tight text-foreground">
            Pick a journey first
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse our journeys and continue to booking from the journey page.
          </p>
          <Link
            href="/tours"
            className="mt-6 inline-block text-sm text-accent hover:text-foreground transition"
          >
            View all journeys →
          </Link>
        </div>
      </section>
    );
  }

  const tour = await getTourBySlug(tourSlug);
  if (!tour) {
    notFound();
  }

  const departures = await getUpcomingDeparturesByTourId(tour.id);

  return (
    <section className="bg-background px-6 py-16 sm:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">Checkout</p>
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          Confirm your details
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          We&apos;ll email you payment instructions immediately. No card needed yet.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          <CheckoutForm tourSlug={tour.slug} tourKind={tour.kind} tourCurrency={tour.baseCurrency} departures={departures} />

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Your journey
              </p>
              <h2 className="mt-2 font-serif text-xl tracking-tight text-foreground">
                {tour.title}
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
                {tour.kind === "open" && " · per stay"} · 1 traveler
              </p>

              <div className="my-6 border-t border-border/60" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-2xl tracking-tight text-foreground">
                  {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Booking holds your spot for 48 hours pending payment.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
