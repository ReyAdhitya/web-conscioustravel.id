import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBookingByReference } from "@/lib/bookings/store";
import { getAllTours } from "@/lib/content/tours";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = await getBookingByReference(reference);

  if (!booking) {
    notFound();
  }

  const tours = await getAllTours();
  const tour = tours.find((t) => t.basePriceMinor === booking.totalMinor) ?? tours[0];

  return (
    <section className="bg-background px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
          Booking received
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
          Terima kasih, <span className="text-accent italic">{booking.contactName.split(" ")[0]}</span>.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Your spot is held for 48 hours. We&apos;ve emailed payment instructions to{" "}
          <span className="text-foreground">{booking.contactEmail}</span>.
        </p>

        <div className="mt-12 rounded-xl border border-border/60 bg-card p-8">
          <div className="flex items-baseline justify-between">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Booking reference
            </p>
            <p className="text-xs text-muted-foreground">Save this</p>
          </div>
          <p className="mt-2 font-mono text-2xl tracking-wider text-foreground">
            {booking.reference}
          </p>

          <div className="my-6 border-t border-border/60" />

          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground">Journey</dt>
              <dd className="mt-1 text-foreground">{tour?.title ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground">Travelers</dt>
              <dd className="mt-1 text-foreground">
                {booking.paxCount} {booking.paxCount === 1 ? "person" : "people"}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground">Total</dt>
              <dd className="mt-1 text-foreground">
                {formatPrice(booking.totalMinor, booking.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                Awaiting payment
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border/60 bg-background p-8">
          <h2 className="font-serif text-xl tracking-tight text-foreground">
            Bank transfer instructions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Online payment (Midtrans + Stripe) lands in the next build chunk. For now:
          </p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">Bank</dt>
              <dd className="text-foreground">BCA · Bank Central Asia</dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">Account name</dt>
              <dd className="text-foreground">PT Conscious Travel Indonesia</dd>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2">
              <dt className="text-muted-foreground">Account number</dt>
              <dd className="font-mono text-foreground">000-000-0000</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="text-foreground">{formatPrice(booking.totalMinor, booking.currency)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Use <span className="font-mono text-foreground">{booking.reference}</span> as the
            transfer reference. Email a screenshot to{" "}
            <span className="text-foreground">bookings@conscioustravel.id</span> once paid.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/tours" className="text-muted-foreground hover:text-foreground transition">
            ← Back to journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
