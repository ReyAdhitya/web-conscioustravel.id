import Link from "next/link";
import type { Metadata } from "next";
import { getAllBookings } from "@/lib/bookings/store";
import { formatPrice } from "@/lib/format";
import type { Booking } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Bookings · Admin",
  robots: { index: false, follow: false },
};

const statusColor: Record<Booking["status"], string> = {
  pending_payment: "bg-accent/15 text-accent",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-zinc-100 text-zinc-600",
  refunded: "bg-zinc-100 text-zinc-600",
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings(200);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">Admin · Bookings</p>
      <h1 className="text-foreground font-serif text-3xl tracking-tight">All bookings</h1>

      <div className="border-border/60 mt-10 overflow-hidden rounded-xl border bg-card">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground p-8 text-center text-sm">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border/60 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
                <th className="px-4 py-3 font-normal">Reference</th>
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 text-right font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 text-right font-normal">When</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-border/40 hover:bg-background/50 border-b last:border-b-0 transition"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={`/admin/bookings/${b.id}`} className="hover:text-accent transition">
                      {b.reference}
                    </Link>
                  </td>
                  <td className="text-foreground px-4 py-3">{b.contactName}</td>
                  <td className="text-muted-foreground px-4 py-3 text-xs">{b.contactEmail}</td>
                  <td className="text-foreground px-4 py-3 text-right">
                    {formatPrice(b.totalMinor, b.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${statusColor[b.status]}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-right text-xs">
                    {formatDate(b.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
