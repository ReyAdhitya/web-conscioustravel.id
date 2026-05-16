import Link from "next/link";
import type { Metadata } from "next";
import { TourCard } from "@/components/tour/TourCard";
import { getAllTours } from "@/lib/content/tours";
import type { Tour } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Journeys",
  description:
    "Sustainable, wellness-focused tours and slow-travel stays across Indonesia. Filter by category to find the right journey.",
  openGraph: {
    title: "Journeys — Conscious Travel Indonesia",
    description:
      "Sustainable, wellness-focused tours and slow-travel stays across Indonesia. Filter by category to find the right journey.",
    type: "website",
  },
};

const categoryFilters: { value: Tour["category"]; label: string }[] = [
  { value: "wellness", label: "Wellness" },
  { value: "eco", label: "Eco" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
];

const kindFilters: { value: Tour["kind"]; label: string }[] = [
  { value: "fixed", label: "Set departures" },
  { value: "open", label: "Open dates" },
];

function buildHref(
  current: { category?: string; kind?: string },
  toggle: { category?: string; kind?: string },
) {
  const next = { ...current };
  if (toggle.category) {
    next.category = current.category === toggle.category ? undefined : toggle.category;
  }
  if (toggle.kind) {
    next.kind = current.kind === toggle.kind ? undefined : toggle.kind;
  }
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.kind) params.set("kind", next.kind);
  const qs = params.toString();
  return qs ? `/tours?${qs}` : "/tours";
}

function isCategory(value: string | undefined): value is Tour["category"] {
  return value === "wellness" || value === "eco" || value === "cultural" || value === "adventure";
}

function isKind(value: string | undefined): value is Tour["kind"] {
  return value === "fixed" || value === "open";
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; kind?: string }>;
}) {
  const params = await searchParams;
  const category = isCategory(params.category) ? params.category : undefined;
  const kind = isKind(params.kind) ? params.kind : undefined;

  const tours = await getAllTours({ category, kind });

  return (
    <>
      <section className="border-border/50 bg-background border-b px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-muted-foreground mb-4 text-xs tracking-[0.25em] uppercase">Journeys</p>
          <h1 className="text-foreground font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Travel that <span className="text-accent italic">returns more than it takes</span>.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
            Curated low-impact journeys across the Indonesian archipelago — small groups, local
            partners, and time enough to slow down.
          </p>
        </div>
      </section>

      <section className="bg-background px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="border-border/50 mb-12 flex flex-wrap items-center gap-x-2 gap-y-3 border-b pb-8">
            <span className="text-muted-foreground mr-3 text-xs tracking-[0.2em] uppercase">
              Filter
            </span>
            {categoryFilters.map((f) => {
              const active = category === f.value;
              return (
                <Link
                  key={f.value}
                  href={buildHref({ category, kind }, { category: f.value })}
                  className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border/60 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
            <span className="text-border mx-2">·</span>
            {kindFilters.map((f) => {
              const active = kind === f.value;
              return (
                <Link
                  key={f.value}
                  href={buildHref({ category, kind }, { kind: f.value })}
                  className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/60 text-muted-foreground hover:border-foreground/60 hover:text-foreground"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
            {(category || kind) && (
              <Link
                href="/tours"
                className="text-muted-foreground hover:text-foreground ml-auto text-xs underline-offset-4 transition hover:underline"
              >
                Clear filters
              </Link>
            )}
          </div>

          {tours.length === 0 ? (
            <div className="border-border/50 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-20 text-center">
              <p className="text-foreground font-serif text-2xl tracking-tight">
                No journeys match these filters.
              </p>
              <p className="text-muted-foreground max-w-md text-sm">
                Try adjusting the category or date type, or browse all journeys.
              </p>
              <Link
                href="/tours"
                className="text-accent hover:text-foreground mt-2 text-sm transition"
              >
                Show all journeys →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8 text-sm">
                {tours.length} {tours.length === 1 ? "journey" : "journeys"}
              </p>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
