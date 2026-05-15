import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";
import { getInquiryById, updateInquiryStatus, updateInquiryNotes } from "@/lib/inquiries/store";
import { formatPrice } from "@/lib/format";
import type { Inquiry } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Inquiry · Admin",
  robots: { index: false, follow: false },
};

const statusColor: Record<Inquiry["status"], string> = {
  new: "bg-accent/15 text-accent",
  in_progress: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-zinc-100 text-zinc-600",
  archived: "bg-zinc-100 text-zinc-600",
};

function formatDate(d: Date | null | string) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  async function updateStatusAction(formData: FormData) {
    "use server";
    const status = formData.get("status") as Inquiry["status"];
    await updateInquiryStatus(id, status);
    revalidatePath(`/admin/inquiries/${id}`);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
  }

  async function updateNotesAction(formData: FormData) {
    "use server";
    const notes = (formData.get("notes") as string) ?? "";
    await updateInquiryNotes(id, notes);
    revalidatePath(`/admin/inquiries/${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <Link
        href="/admin/inquiries"
        className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm transition"
      >
        ← Inquiries
      </Link>
      <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">Inquiry</p>
      <h1 className="text-foreground font-serif text-3xl tracking-tight font-mono">{inquiry.reference}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="border-border/60 bg-card rounded-xl border p-6 lg:col-span-2 space-y-5">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Contact & trip details</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Name</p>
              <p className="text-foreground">{inquiry.contactName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Email</p>
              <p className="text-foreground">{inquiry.contactEmail}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Phone</p>
              <p className="text-foreground">{inquiry.contactPhone}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Group size</p>
              <p className="text-foreground">{inquiry.groupSize ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Travel window</p>
              <p className="text-foreground">
                {inquiry.travelStart ? `${formatDate(inquiry.travelStart)} → ${formatDate(inquiry.travelEnd)}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">Budget</p>
              <p className="text-foreground">
                {inquiry.budgetMinMinor && inquiry.budgetCurrency
                  ? `${formatPrice(inquiry.budgetMinMinor, inquiry.budgetCurrency)} – ${inquiry.budgetMaxMinor ? formatPrice(inquiry.budgetMaxMinor, inquiry.budgetCurrency) : "open"}`
                  : "—"}
              </p>
            </div>
            {inquiry.interests.length > 0 && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-1">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {inquiry.interests.map((t) => (
                    <span key={t} className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {inquiry.destinations.length > 0 && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-1">Destinations</p>
                <div className="flex flex-wrap gap-1.5">
                  {inquiry.destinations.map((d) => (
                    <span key={d} className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs">{d}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs mb-0.5">Message</p>
              <p className="text-foreground whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-border/60 bg-card rounded-xl border p-6 space-y-4">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Status</p>
            <span className={`inline-block rounded-full px-3 py-1 text-xs tracking-wide ${statusColor[inquiry.status]}`}>
              {inquiry.status.replace("_", " ")}
            </span>
            <form action={updateStatusAction} className="space-y-3 pt-1">
              <select
                name="status"
                defaultValue={inquiry.status}
                className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              >
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
                <option value="archived">Archived</option>
              </select>
              <button
                type="submit"
                className="bg-foreground text-background w-full rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-80"
              >
                Update status
              </button>
            </form>
          </div>

          <div className="border-border/60 bg-card rounded-xl border p-6 space-y-3">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Internal notes</p>
            <form action={updateNotesAction} className="space-y-3">
              <textarea
                name="notes"
                rows={5}
                defaultValue={inquiry.internalNotes ?? ""}
                placeholder="Add private notes visible only to the team…"
                className="border-border bg-background text-foreground w-full resize-none rounded-lg border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="bg-foreground text-background w-full rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-80"
              >
                Save notes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
