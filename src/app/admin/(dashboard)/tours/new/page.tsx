import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createTour } from "@/lib/tours/store";

export const metadata: Metadata = {
  title: "Admin · New Tour",
  robots: { index: false, follow: false },
};

async function createTourAction(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  let slug = (formData.get("slug") as string).trim();
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const inclusionsRaw = (formData.get("inclusions") as string) ?? "";
  const exclusionsRaw = (formData.get("exclusions") as string) ?? "";
  const inclusions = inclusionsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const exclusions = exclusionsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const tour = await createTour({
    title,
    slug,
    kind: formData.get("kind") as "fixed" | "open",
    category: formData.get("category") as "wellness" | "eco" | "cultural" | "adventure",
    shortDescription: formData.get("shortDescription") as string,
    longDescription: formData.get("longDescription") as string,
    durationDays: parseInt(formData.get("durationDays") as string, 10),
    basePriceMinor: BigInt(formData.get("basePriceMinor") as string),
    baseCurrency: "IDR",
    heroImageUrl: formData.get("heroImageUrl") as string,
    minPax: parseInt(formData.get("minPax") as string, 10),
    maxPax: parseInt(formData.get("maxPax") as string, 10),
    inclusions,
    exclusions,
    galleryImageUrls: [],
    itinerary: [],
  });

  redirect(`/admin/tours/${tour.id}`);
}

export default function NewTourPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <p className="text-muted-foreground mb-1 text-xs tracking-[0.25em] uppercase">Tours</p>
      <h1 className="font-serif text-3xl tracking-tight">New tour</h1>

      <form action={createTourAction} className="mt-10">
        <TourFormFields />
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-foreground text-background rounded-lg px-6 py-2.5 text-sm transition hover:opacity-80"
          >
            Create tour
          </button>
        </div>
      </form>
    </div>
  );
}

export function TourFormFields({
  defaults,
}: {
  defaults?: {
    title?: string;
    slug?: string;
    kind?: string;
    category?: string;
    shortDescription?: string;
    longDescription?: string;
    durationDays?: number;
    basePriceMinor?: bigint;
    heroImageUrl?: string;
    minPax?: number;
    maxPax?: number;
    inclusions?: string[];
    exclusions?: string[];
  };
}) {
  return (
    <div className="border-border/60 bg-card rounded-xl border p-6 space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={defaults?.title ?? ""}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={defaults?.slug ?? ""}
            placeholder="auto-generated from title"
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Kind
          </label>
          <select
            name="kind"
            required
            defaultValue={defaults?.kind ?? "fixed"}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="fixed">Fixed</option>
            <option value="open">Open</option>
          </select>
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue={defaults?.category ?? "wellness"}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="wellness">Wellness</option>
            <option value="eco">Eco</option>
            <option value="cultural">Cultural</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
          Short description
        </label>
        <textarea
          name="shortDescription"
          required
          rows={2}
          defaultValue={defaults?.shortDescription ?? ""}
          className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
          Long description
        </label>
        <textarea
          name="longDescription"
          required
          rows={5}
          defaultValue={defaults?.longDescription ?? ""}
          className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Duration (days)
          </label>
          <input
            type="number"
            name="durationDays"
            required
            min={1}
            defaultValue={defaults?.durationDays ?? ""}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Min pax
          </label>
          <input
            type="number"
            name="minPax"
            required
            min={1}
            defaultValue={defaults?.minPax ?? 1}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Max pax
          </label>
          <input
            type="number"
            name="maxPax"
            required
            min={1}
            defaultValue={defaults?.maxPax ?? 20}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
          Base price (IDR, minor units — e.g. 12500000 = Rp 125.000)
        </label>
        <input
          type="number"
          name="basePriceMinor"
          required
          min={0}
          defaultValue={defaults?.basePriceMinor !== undefined ? String(defaults.basePriceMinor) : ""}
          className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
          Hero image URL
        </label>
        <input
          type="text"
          name="heroImageUrl"
          required
          defaultValue={defaults?.heroImageUrl ?? ""}
          className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Inclusions (one per line)
          </label>
          <textarea
            name="inclusions"
            rows={4}
            defaultValue={defaults?.inclusions?.join("\n") ?? ""}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-muted-foreground mb-1 block text-xs tracking-[0.25em] uppercase">
            Exclusions (one per line)
          </label>
          <textarea
            name="exclusions"
            rows={4}
            defaultValue={defaults?.exclusions?.join("\n") ?? ""}
            className="border-border/60 bg-background focus:ring-accent/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
