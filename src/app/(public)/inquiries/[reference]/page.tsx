import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInquiryByReference } from "@/lib/inquiries/store";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Inquiry received",
  robots: { index: false, follow: false },
};

export default async function InquiryConfirmationPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const inquiry = await getInquiryByReference(reference);

  if (!inquiry) {
    notFound();
  }

  return (
    <section className="bg-background px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
          Inquiry received
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
          Terima kasih,{" "}
          <span className="text-accent italic">{inquiry.contactName.split(" ")[0]}</span>.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A real person will read this and come back within two business days at{" "}
          <span className="text-foreground">{inquiry.contactEmail}</span> with a custom proposal.
        </p>

        <div className="mt-12 rounded-xl border border-border/60 bg-card p-8">
          <div className="flex items-baseline justify-between">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Inquiry reference
            </p>
            <p className="text-xs text-muted-foreground">Save this</p>
          </div>
          <p className="mt-2 font-mono text-2xl tracking-wider text-foreground">
            {inquiry.reference}
          </p>

          <div className="my-6 border-t border-border/60" />

          <dl className="grid gap-4 text-sm">
            {(inquiry.travelStart || inquiry.travelEnd) && (
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground">Window</dt>
                <dd className="mt-1 text-foreground">
                  {inquiry.travelStart ?? "flexible"} → {inquiry.travelEnd ?? "flexible"}
                </dd>
              </div>
            )}
            {inquiry.groupSize && (
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground">Travelers</dt>
                <dd className="mt-1 text-foreground">{inquiry.groupSize}</dd>
              </div>
            )}
            {inquiry.interests.length > 0 && (
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground">Interests</dt>
                <dd className="mt-1 text-foreground">{inquiry.interests.join(" · ")}</dd>
              </div>
            )}
            {inquiry.destinations.length > 0 && (
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground">Destinations</dt>
                <dd className="mt-1 text-foreground">{inquiry.destinations.join(" · ")}</dd>
              </div>
            )}
            {inquiry.budgetMinMinor && inquiry.budgetMaxMinor && inquiry.budgetCurrency && (
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground">Budget per person</dt>
                <dd className="mt-1 text-foreground">
                  {formatPrice(inquiry.budgetMinMinor, inquiry.budgetCurrency)} —{" "}
                  {formatPrice(inquiry.budgetMaxMinor, inquiry.budgetCurrency)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/tours" className="text-muted-foreground hover:text-foreground transition">
            ← Browse pre-built journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
