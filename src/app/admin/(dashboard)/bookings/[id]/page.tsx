import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { getBookingById, updateBookingStatus } from "@/lib/bookings/store";
import { formatPrice } from "@/lib/format";
import type { Booking } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Booking · Admin",
  robots: { index: false, follow: false },
};

const statusColor: Record<Booking["status"], string> = {
  pending_payment: "bg-accent/15 text-accent",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-zinc-100 text-zinc-600",
  refunded: "bg-zinc-100 text-zinc-600",
};

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  async function updateStatusAction(formData: FormData) {
    "use server";
    const status = formData.get("status") as Booking["status"];
    const reason = (formData.get("reason") as string) || undefined;
    await updateBookingStatus(id, status, reason);
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <Link
        href="/admin/bookings"
        className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm transition"
      >
        ← Bookings
      </Link>
      <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">Booking</p>
      <h1 className="text-foreground font-serif text-3xl tracking-tight font-mono">{booking.reference}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="border-border/60 bg-card rounded-xl border p-6 lg:col-span-2 space-y-5">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Contact & booking details</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Name</p>
              <p className="text-foreground">{booking.contactName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Email</p>
              <p className="text-foreground">{booking.contactEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Phone</p>
              <p className="text-foreground">{booking.contactPhone}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Pax</p>
              <p className="text-foreground">{booking.paxCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Total</p>
              <p className="text-foreground font-medium">{formatPrice(booking.totalMinor, booking.currency)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Created</p>
              <p className="text-foreground">{formatDate(booking.createdAt)}</p>
            </div>
            {booking.notes && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-0.5">Notes from guest</p>
                <p className="text-foreground">{booking.notes}</p>
              </div>
            )}
            {booking.cancelledAt && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-0.5">Cancelled at</p>
                <p className="text-foreground">{formatDate(booking.cancelledAt)}</p>
                {booking.cancellationReason && (
                  <p className="text-muted-foreground text-xs mt-0.5">{booking.cancellationReason}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-border/60 bg-card rounded-xl border p-6 space-y-4">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Status</p>
          <span className={`inline-block rounded-full px-3 py-1 text-xs tracking-wide ${statusColor[booking.status]}`}>
            {booking.status.replace("_", " ")}
          </span>

          <form action={updateStatusAction} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs" htmlFor="status">
                Update status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={booking.status}
                className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              >
                <option value="pending_payment">Pending payment</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground text-xs" htmlFor="reason">
                Cancellation reason (optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={2}
                defaultValue={booking.cancellationReason ?? ""}
                className="border-border bg-background text-foreground w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-foreground text-background w-full rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-80"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
