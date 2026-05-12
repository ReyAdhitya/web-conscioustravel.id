import Link from "next/link";
import type { Metadata } from "next";
import { getAllBookings, getBookingStats } from "@/lib/bookings/store";
import { getAllInquiries, getInquiryStats } from "@/lib/inquiries/store";
import { formatPrice } from "@/lib/format";
import type { Booking, Inquiry } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

const bookingStatusColor: Record<Booking["status"], string> = {
  pending_payment: "bg-accent/15 text-accent",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-zinc-100 text-zinc-600",
  refunded: "bg-zinc-100 text-zinc-600",
};

const inquiryStatusColor: Record<Inquiry["status"], string> = {
  new: "bg-accent/15 text-accent",
  in_progress: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-zinc-100 text-zinc-600",
  archived: "bg-zinc-100 text-zinc-600",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminDashboardPage() {
  const [bookingStats, inquiryStats, bookings, inquiries] = await Promise.all([
    getBookingStats(),
    getInquiryStats(),
    getAllBookings(20),
    getAllInquiries(20),
  ]);

  const revenueIDR = bookingStats.totalRevenueByCurrency.IDR ?? BigInt(0);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">Dashboard</p>
      <h1 className="text-foreground font-serif text-3xl tracking-tight">
        At a glance, <span className="text-accent italic">today</span>.
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bookings" value={bookingStats.total.toString()} sub={`${bookingStats.pending} awaiting payment`} />
        <StatCard label="Revenue (IDR)" value={formatPrice(revenueIDR, "IDR")} sub="Sum of all bookings" />
        <StatCard label="Inquiries" value={inquiryStats.total.toString()} sub={`${inquiryStats.newCount} new`} />
        <StatCard label="In progress" value={inquiryStats.inProgress.toString()} sub="Inquiries actively quoted" />
      </div>

      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-foreground font-serif text-xl tracking-tight">Recent bookings</h2>
          <span className="text-muted-foreground text-xs">
            Showing {bookings.length} most recent
          </span>
        </div>
        <div className="border-border/60 overflow-hidden rounded-xl border bg-card">
          {bookings.length === 0 ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No bookings yet. Submit one from the public site to see it appear here.
            </p>
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
                  <tr key={b.id} className="border-border/40 hover:bg-background/50 border-b last:border-b-0 transition">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/bookings/${b.reference}`} target="_blank" className="hover:text-accent transition">
                        {b.reference}
                      </Link>
                    </td>
                    <td className="text-foreground px-4 py-3">{b.contactName}</td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">{b.contactEmail}</td>
                    <td className="text-foreground px-4 py-3 text-right">
                      {formatPrice(b.totalMinor, b.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${bookingStatusColor[b.status]}`}>
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
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-foreground font-serif text-xl tracking-tight">Recent inquiries</h2>
          <span className="text-muted-foreground text-xs">
            Showing {inquiries.length} most recent
          </span>
        </div>
        <div className="border-border/60 overflow-hidden rounded-xl border bg-card">
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground p-8 text-center text-sm">
              No inquiries yet. Submit one from /inquiry on the public site.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
                  <th className="px-4 py-3 font-normal">Reference</th>
                  <th className="px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Email</th>
                  <th className="px-4 py-3 text-right font-normal">Group</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 text-right font-normal">When</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i.id} className="border-border/40 hover:bg-background/50 border-b last:border-b-0 transition">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/inquiries/${i.reference}`} target="_blank" className="hover:text-accent transition">
                        {i.reference}
                      </Link>
                    </td>
                    <td className="text-foreground px-4 py-3">{i.contactName}</td>
                    <td className="text-muted-foreground px-4 py-3 text-xs">{i.contactEmail}</td>
                    <td className="text-foreground px-4 py-3 text-right">{i.groupSize ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${inquiryStatusColor[i.status]}`}>
                        {i.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-right text-xs">
                      {formatDate(i.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border-border/60 bg-card rounded-xl border p-5">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</p>
      <p className="text-foreground mt-2 font-serif text-2xl tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{sub}</p>
    </div>
  );
}
