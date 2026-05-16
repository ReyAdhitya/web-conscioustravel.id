import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getBookingByReference } from "@/lib/bookings/store";
import { getAllTours } from "@/lib/content/tours";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { formatPrice } from "@/lib/format";
import { createSnapTransaction } from "@/lib/payments/midtrans";
import { PayButton } from "./PayButton";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

async function initiatePayment(bookingId: string): Promise<{ token: string }> {
  "use server";
  const allBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  const booking = allBookings[0];
  if (!booking) throw new Error("Booking not found");

  const result = await createSnapTransaction({
    bookingId: booking.id,
    reference: booking.reference,
    amount: Number(booking.totalMinor),
    currency: booking.currency,
    customerName: booking.contactName,
    customerEmail: booking.contactEmail,
    customerPhone: booking.contactPhone,
    itemName: "Conscious Travel Journey",
  });
  return { token: result.token };
}

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_URL = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

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

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
  const showPayButton =
    booking.status === "pending_payment" && booking.currency === "IDR";

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
                {booking.status === "confirmed" ? "Confirmed" : "Awaiting payment"}
              </dd>
            </div>
          </dl>
        </div>

        {showPayButton ? (
          <PayButton
            bookingId={booking.id}
            snapUrl={SNAP_URL}
            clientKey={clientKey}
            initiatePayment={initiatePayment}
            onSuccess={async () => {
              "use server";
              redirect(`/bookings/${reference}`);
            }}
          />
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-accent">
              Demo mode
            </div>
            <h2 className="font-serif text-xl tracking-tight text-foreground">
              Payment instructions (placeholder)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This block becomes real once the business bank account, Resend (email API), and
              Midtrans + Stripe gateways are wired. Until then the values below are demo data.
            </p>
            <dl className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">Bank</dt>
                <dd className="text-foreground">BCA · Bank Central Asia <span className="text-muted-foreground">(demo)</span></dd>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">Account name</dt>
                <dd className="text-foreground">PT Conscious Travel Indonesia <span className="text-muted-foreground">(demo)</span></dd>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <dt className="text-muted-foreground">Account number</dt>
                <dd className="font-mono text-muted-foreground italic">— pending real account —</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="text-foreground">{formatPrice(booking.totalMinor, booking.currency)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Reference code <span className="font-mono text-foreground">{booking.reference}</span>{" "}
              is real and unique. The email mentioned above is not actually sent yet.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/tours" className="text-muted-foreground hover:text-foreground transition">
            ← Back to journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
