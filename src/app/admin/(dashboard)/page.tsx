import Link from "next/link";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getAllBookings, getBookingStats } from "@/lib/bookings/store";
import { getAllInquiries, getInquiryStats } from "@/lib/inquiries/store";
import { formatPrice } from "@/lib/format";
import type { Booking, Inquiry } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

type StatusTone = "positive" | "active" | "critical" | "muted";

// One status vocabulary for bookings + inquiries, mapped onto the cream/forest
// tokens from DESIGN.md (no raw palette colors): forest = good outcome,
// ink = in flight, warm red = stopped, sand = settled.
const STATUS_TONE: Record<Booking["status"] | Inquiry["status"], StatusTone> = {
  pending_payment: "active",
  confirmed: "positive",
  cancelled: "critical",
  refunded: "muted",
  new: "active",
  in_progress: "active",
  quoted: "active",
  won: "positive",
  lost: "critical",
  archived: "muted",
};

const TONE_CLASS: Record<StatusTone, { pill: string; dot: string }> = {
  positive: { pill: "bg-accent/10 text-accent", dot: "bg-accent" },
  active: { pill: "bg-bg-soft text-foreground", dot: "bg-foreground/50" },
  critical: { pill: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  muted: { pill: "bg-bg-soft text-muted-foreground", dot: "bg-muted-foreground/50" },
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
        <StatCard
          label="Bookings"
          value={bookingStats.total.toString()}
          sub={`${bookingStats.pending} awaiting payment`}
        />
        <StatCard label="Revenue (IDR)" value={formatPrice(revenueIDR, "IDR")} sub="Sum of all bookings" />
        <StatCard label="Inquiries" value={inquiryStats.total.toString()} sub={`${inquiryStats.newCount} new`} />
        <StatCard label="In progress" value={inquiryStats.inProgress.toString()} sub="Inquiries actively quoted" />
      </div>

      <DashboardSection
        title="Recent bookings"
        count={bookings.length}
        isEmpty={bookings.length === 0}
        emptyText="No bookings yet. Submit one from the public site to see it appear here."
      >
        <thead>
          <tr className="border-border/40 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
            <Th>Reference</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th align="right">Total</Th>
            <Th>Status</Th>
            <Th align="right">When</Th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <Row key={b.id}>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                <Link href={`/admin/bookings/${b.id}`} className="hover:text-accent transition-colors">
                  {b.reference}
                </Link>
              </td>
              <td className="text-foreground px-4 py-3 whitespace-nowrap">{b.contactName}</td>
              <td className="text-muted-foreground px-4 py-3 text-xs whitespace-nowrap">{b.contactEmail}</td>
              <td className="text-foreground px-4 py-3 text-right tabular-nums whitespace-nowrap">
                {formatPrice(b.totalMinor, b.currency)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={b.status} />
              </td>
              <td className="text-muted-foreground px-4 py-3 text-right text-xs tabular-nums whitespace-nowrap">
                {formatDate(b.createdAt)}
              </td>
            </Row>
          ))}
        </tbody>
      </DashboardSection>

      <DashboardSection
        title="Recent inquiries"
        count={inquiries.length}
        isEmpty={inquiries.length === 0}
        emptyText="No inquiries yet. Submit one from /inquiry on the public site."
      >
        <thead>
          <tr className="border-border/40 text-muted-foreground border-b text-left text-[11px] tracking-[0.15em] uppercase">
            <Th>Reference</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th align="right">Group</Th>
            <Th>Status</Th>
            <Th align="right">When</Th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((i) => (
            <Row key={i.id}>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                <Link href={`/admin/inquiries/${i.id}`} className="hover:text-accent transition-colors">
                  {i.reference}
                </Link>
              </td>
              <td className="text-foreground px-4 py-3 whitespace-nowrap">{i.contactName}</td>
              <td className="text-muted-foreground px-4 py-3 text-xs whitespace-nowrap">{i.contactEmail}</td>
              <td className="text-foreground px-4 py-3 text-right tabular-nums">{i.groupSize ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={i.status} />
              </td>
              <td className="text-muted-foreground px-4 py-3 text-right text-xs tabular-nums whitespace-nowrap">
                {formatDate(i.createdAt)}
              </td>
            </Row>
          ))}
        </tbody>
      </DashboardSection>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] | Inquiry["status"] }) {
  const tone = TONE_CLASS[STATUS_TONE[status]];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] capitalize ${tone.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function DashboardSection({
  title,
  count,
  isEmpty,
  emptyText,
  children,
}: {
  title: string;
  count: number;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-foreground font-serif text-xl tracking-tight">{title}</h2>
        <span className="text-muted-foreground text-xs">Showing {count} most recent</span>
      </div>
      <div className="border-border/60 overflow-x-auto rounded-xl border bg-background">
        {isEmpty ? (
          <p className="text-muted-foreground p-8 text-center text-sm">{emptyText}</p>
        ) : (
          <table className="w-full text-sm">{children}</table>
        )}
      </div>
    </section>
  );
}

function Th({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return (
    <th scope="col" className={`px-4 py-3 font-normal whitespace-nowrap ${align === "right" ? "text-right" : ""}`}>
      {children}
    </th>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <tr className="border-border/40 hover:bg-bg-soft border-b transition-colors last:border-b-0">{children}</tr>
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
