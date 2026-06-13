import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { TourCard } from "@/components/tour/TourCard";
import { getAllTours } from "@/lib/content/tours";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Journeys",
  description:
    "Sustainable, wellness-focused tours and slow-travel stays across Indonesia. Filter by category to find the right journey.",
  openGraph: {
    title: "Journeys · Conscious Travel Indonesia",
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

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

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

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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
  const [lead, ...rest] = tours;
  const allCategoriesHref = kind ? `/tours?kind=${kind}` : "/tours";

  return (
    <>
      {/* Masthead — wide left-aligned title, the page's editorial nameplate. */}
      <section className="px-6 pt-16 pb-12 sm:px-12 sm:pt-20 lg:px-20 lg:pt-24">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-muted-foreground mb-4 text-[11px] tracking-[0.25em] uppercase">
            The index
          </p>
          <h1 className="max-w-[16ch] font-serif text-[44px] leading-[1.0] tracking-[-0.03em] sm:text-[60px] lg:text-[76px]">
            Travel that <span className="text-accent italic">returns more than it takes</span>.
          </h1>
          <p className="text-ink-soft mt-7 max-w-[58ch] text-base leading-[1.7] sm:text-lg">
            Curated low-impact journeys across the Indonesian archipelago. Small groups, local
            partners, and time enough to slow down. Read each one in full before you decide.
          </p>
        </div>
      </section>

      {/* Filter rail — a horizontal pill nav, not a sidebar. Category is primary;
          date type is a quieter secondary set. */}
      <section className="px-6 sm:px-12 lg:px-20">
        <div className="border-border/60 mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-3 border-y py-6">
          <Link
            href={allCategoriesHref}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
              !category
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-ink-soft hover:border-accent/50 hover:text-foreground"
            }`}
          >
            All
          </Link>
          {categoryFilters.map((f) => {
            const active = category === f.value;
            return (
              <Link
                key={f.value}
                href={buildHref({ category, kind }, { category: f.value })}
                className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-ink-soft hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {f.label}
              </Link>
            );
          })}

          <span className="bg-border mx-3 hidden h-5 w-px sm:block" aria-hidden />

          {kindFilters.map((f) => {
            const active = kind === f.value;
            return (
              <Link
                key={f.value}
                href={buildHref({ category, kind }, { kind: f.value })}
                className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-ink-soft hover:border-foreground/60 hover:text-foreground"
                }`}
              >
                {f.label}
              </Link>
            );
          })}

          <span className="text-muted-foreground ml-auto text-xs">
            {tours.length} {tours.length === 1 ? "journey" : "journeys"}
          </span>
        </div>
      </section>

      {tours.length === 0 ? (
        <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20">
          <div className="border-border bg-card mx-auto flex w-full max-w-6xl flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed px-6 py-20 text-center">
            <p className="text-foreground font-serif text-2xl tracking-[-0.01em]">
              No journeys match these filters.
            </p>
            <p className="text-muted-foreground max-w-md text-sm leading-[1.6]">
              Try adjusting the category or date type, or browse all journeys.
            </p>
            <Link
              href="/tours"
              className="text-accent hover:text-foreground mt-2 text-sm transition"
            >
              Show all journeys →
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl">
            {/* Lead cover story — the spread's opening feature. */}
            <CoverStory tour={lead} />

            {rest.length > 0 && (
              <div className="border-border/60 mt-16 grid grid-cols-1 gap-x-8 gap-y-12 border-t pt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-6 lg:pt-20">
                {rest.map((tour, i) => {
                  // Every fourth slot opens to a full-width interstitial feature,
                  // so the column rhythm keeps breaking — a spread, not a catalog.
                  const wide = i % 4 === 3;
                  return wide ? (
                    <div key={tour.id} className="sm:col-span-2 lg:col-span-6">
                      <InterstitialFeature tour={tour} />
                    </div>
                  ) : (
                    <div key={tour.id} className="lg:col-span-2">
                      <TourCard tour={tour} index={i} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

function CoverStory({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14"
    >
      <div className="lg:col-span-7">
        <div className="bg-bg-soft relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius)]">
          {isValidUrl(tour.heroImageUrl) ? (
            <Image
              src={tour.heroImageUrl}
              alt={tour.title}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-[1.03]"
            />
          ) : (
            <Placeholder />
          )}
        </div>
      </div>
      <div className="lg:col-span-5">
        <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
          Featured journey · {categoryLabel[tour.category]}
          {tour.kind === "open" && " · flexible dates"}
        </p>
        <h2 className="text-foreground group-hover:text-accent mt-4 font-serif text-3xl leading-[1.05] tracking-[-0.025em] transition-colors sm:text-4xl lg:text-[44px]">
          {tour.title}
        </h2>
        <p className="text-ink-soft mt-5 max-w-[48ch] text-[15px] leading-[1.7] sm:text-base">
          {tour.shortDescription}
        </p>
        <div className="mt-7 flex items-baseline gap-6 text-sm">
          <span className="text-foreground">
            From{" "}
            <strong className="font-serif text-base font-medium tracking-[-0.01em]">
              {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
            </strong>
          </span>
          <span className="text-muted-foreground">
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          </span>
        </div>
        <span className="text-foreground mt-7 inline-flex items-center gap-2 text-sm">
          <span className="border-foreground/30 group-hover:border-accent group-hover:text-accent border-b pb-1 transition-colors">
            View journey
          </span>
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function InterstitialFeature({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group border-border/60 bg-card hover:border-accent/40 grid overflow-hidden rounded-[var(--radius)] border transition-colors lg:grid-cols-2 lg:items-stretch"
    >
      <div className="order-2 flex flex-col justify-center gap-4 p-8 sm:p-10 lg:order-1 lg:p-12">
        <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
          {categoryLabel[tour.category]}
          {tour.kind === "open" && " · flexible dates"}
        </p>
        <h3 className="text-foreground group-hover:text-accent font-serif text-2xl leading-[1.08] tracking-[-0.02em] transition-colors sm:text-3xl">
          {tour.title}
        </h3>
        <p className="text-ink-soft max-w-[46ch] text-[15px] leading-[1.7]">
          {tour.shortDescription}
        </p>
        <div className="mt-1 flex items-baseline gap-5 text-sm">
          <span className="text-foreground">
            From{" "}
            <strong className="font-serif text-base font-medium tracking-[-0.01em]">
              {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
            </strong>
          </span>
          <span className="text-muted-foreground">
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
            {tour.kind === "open" && " · per stay"}
          </span>
        </div>
      </div>
      <div className="relative order-1 min-h-[240px] lg:order-2 lg:min-h-[360px]">
        {isValidUrl(tour.heroImageUrl) ? (
          <Image
            src={tour.heroImageUrl}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-[filter] duration-500 group-hover:brightness-[1.03]"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </Link>
  );
}

function Placeholder() {
  return (
    <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]" />
  );
}
