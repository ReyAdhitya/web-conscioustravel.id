import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAllTours, getTourBySlug } from "@/lib/content/tours";
import { getUpcomingDeparturesByTourId } from "@/lib/departures/store";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

const departureFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

function isValidUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function generateStaticParams() {
  const tours = await getAllTours();
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) {
    return { title: "Journey not found" };
  }
  return {
    title: tour.title,
    description: tour.shortDescription,
    openGraph: {
      title: tour.title,
      description: tour.shortDescription,
      type: "website",
    },
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const departures = await getUpcomingDeparturesByTourId(tour.id);
  const isFixedWithoutDepartures = tour.kind === "fixed" && departures.length === 0;

  const gallery = (tour.galleryImageUrls ?? []).filter((u) => isValidUrl(u));
  const plate = gallery[0];
  const closingPlates = gallery.slice(1, 4);

  return (
    <article>
      {/* Masthead — title and key facts, set quietly above the image. */}
      <header className="px-6 pt-8 sm:px-12 sm:pt-12 lg:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-ink-soft mb-5 inline-flex items-center gap-2 text-[13px]">
            <span className="bg-foreground/95 text-background inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.18em] uppercase">
              {categoryLabel[tour.category]}
              {tour.kind === "open" && <span className="opacity-70">· flexible dates</span>}
            </span>
          </div>
          <h1 className="max-w-[18ch] font-serif text-[40px] leading-[1.0] tracking-[-0.03em] sm:text-[56px] lg:text-[68px]">
            {tour.title}
          </h1>
          <p className="text-muted-foreground mt-6 text-sm tracking-[0.02em]">
            From{" "}
            <span className="text-foreground font-medium">
              {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
            </span>{" "}
            · {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"} ·{" "}
            {categoryLabel[tour.category]} journey
          </p>
        </div>
      </header>

      {/* Hero — one cinematic plate, edge-breaking, never boxed to a card grid. */}
      <div className="mt-8 px-6 sm:mt-10 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="bg-bg-soft relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] sm:aspect-[2/1]">
            <SafeImage
              src={tour.heroImageUrl}
              alt={tour.title}
              fill
              priority
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover"
              fallback={<Placeholder />}
            />
          </div>
        </div>
      </div>

      {/* Body — a long reading column with a sticky booking aside. */}
      <div className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-x-16 gap-y-16 lg:grid-cols-[1fr_minmax(300px,340px)] lg:gap-x-24">
          <div className="min-w-0">
            {/* Standfirst + body */}
            <p className="text-muted-foreground mb-6 text-[11px] tracking-[0.22em] uppercase">
              The journey
            </p>
            <p className="text-foreground max-w-[34ch] font-serif text-2xl leading-[1.28] tracking-[-0.01em] sm:text-[28px]">
              {tour.shortDescription}
            </p>
            <p className="text-ink-soft first-letter:text-accent mt-8 max-w-[62ch] text-[16px] leading-[1.8] first-letter:float-left first-letter:m-0 first-letter:mr-3 first-letter:font-serif first-letter:text-[3.4rem] first-letter:leading-[0.78]">
              {tour.longDescription}
            </p>

            {/* Inline plate — breaks the column the way a magazine breaks a page. */}
            {plate && (
              <figure className="mt-12">
                <div className="bg-bg-soft relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius)]">
                  <SafeImage
                    src={plate}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 64vw, 100vw"
                    className="object-cover"
                    fallback={null}
                  />
                </div>
              </figure>
            )}

            {/* Itinerary — set as prose, marked by hanging serif numerals. */}
            {tour.itinerary.length > 0 && (
              <section
                className="border-border mt-16 border-t pt-14 sm:mt-20"
                aria-labelledby="itinerary"
              >
                <Reveal className="flex items-baseline justify-between gap-4">
                  <h2
                    id="itinerary"
                    className="font-serif text-3xl tracking-[-0.025em] sm:text-4xl"
                  >
                    The itinerary
                  </h2>
                  <span className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                    {tour.itinerary.length} {tour.itinerary.length === 1 ? "day" : "days"}
                  </span>
                </Reveal>
                <RevealGroup as="ol" className="mt-12">
                  {tour.itinerary.map((day) => (
                    <RevealItem
                      as="li"
                      key={day.day}
                      className="border-border/70 grid grid-cols-[3.25rem_1fr] gap-x-5 border-t py-9 first:border-t-0 first:pt-0 sm:grid-cols-[5.5rem_1fr] sm:gap-x-10"
                    >
                      <div>
                        <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                          Day
                        </span>
                        <span className="text-foreground/50 mt-1 block font-serif text-4xl leading-none tracking-[-0.03em] tabular-nums sm:text-[3.25rem]">
                          {String(day.day).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="max-w-[58ch] pt-0.5">
                        <h3 className="text-foreground font-serif text-xl tracking-[-0.01em] sm:text-2xl">
                          {day.title}
                        </h3>
                        <p className="text-ink-soft mt-3 text-[15px] leading-[1.75]">
                          {day.description}
                        </p>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </section>
            )}

            {/* Inclusions — an editorial list, ruled by hairlines, not a checklist box. */}
            <section
              className="border-border mt-16 border-t pt-14 sm:mt-20"
              aria-labelledby="included"
            >
              <h2 id="included" className="font-serif text-3xl tracking-[-0.025em] sm:text-4xl">
                What you can expect
              </h2>
              <div className="mt-10 grid gap-x-16 gap-y-12 sm:grid-cols-2">
                <div>
                  <p className="text-accent text-[11px] tracking-[0.2em] uppercase">Included</p>
                  <ul className="mt-5">
                    {tour.inclusions.map((item) => (
                      <li
                        key={item}
                        className="border-border/60 text-ink-soft flex items-start gap-3 border-t py-3.5 text-[15px] leading-[1.6] first:border-t-0 first:pt-0"
                      >
                        <span className="text-accent mt-[0.45em] text-[9px]" aria-hidden>
                          ✦
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tour.exclusions.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
                      Not included
                    </p>
                    <ul className="mt-5">
                      {tour.exclusions.map((item) => (
                        <li
                          key={item}
                          className="border-border/60 text-muted-foreground flex items-start gap-3 border-t py-3.5 text-[15px] leading-[1.6] first:border-t-0 first:pt-0"
                        >
                          <span
                            className="text-muted-foreground/50 mt-[0.5em] text-[11px]"
                            aria-hidden
                          >
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Closing plates — a quiet trio to end the read. */}
            {closingPlates.length > 0 && (
              <div className="mt-16 grid grid-cols-3 gap-2.5 sm:gap-3">
                {closingPlates.map((src, i) => (
                  <div
                    key={i}
                    className="bg-bg-soft relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)]"
                  >
                    <SafeImage
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 21vw, 33vw"
                      className="object-cover"
                      fallback={null}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky booking aside. */}
          <aside className="bg-card self-start rounded-[var(--radius)] p-7 sm:p-8 lg:sticky lg:top-28">
            <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">From</p>
            <p className="text-foreground mt-1 font-serif text-3xl tracking-[-0.02em]">
              {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              per person · {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
              {tour.kind === "open" && " · per stay"}
            </p>

            <div className="border-border my-6 border-t" />

            <div className="flex flex-col gap-3">
              {tour.kind === "fixed" ? (
                departures.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-muted-foreground text-xs tracking-wide">
                      Upcoming departures
                    </span>
                    <ul className="border-border divide-border/60 bg-background divide-y rounded-lg border">
                      {departures.slice(0, 4).map((dep) => {
                        const spotsLeft = dep.capacity - dep.bookedCount;
                        const soldOut = dep.status === "sold_out" || spotsLeft <= 0;
                        return (
                          <li
                            key={dep.id}
                            className="flex items-center justify-between px-3 py-2.5 text-sm"
                          >
                            <span className="text-foreground tabular-nums">
                              {departureFmt.format(new Date(dep.startsOn + "T00:00:00"))}
                            </span>
                            <span
                              className={
                                soldOut
                                  ? "text-muted-foreground text-xs"
                                  : "text-accent text-xs font-medium"
                              }
                            >
                              {soldOut
                                ? "Sold out"
                                : `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"}`}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <div className="border-border bg-background flex flex-col gap-1.5 rounded-lg border border-dashed p-4 text-sm">
                    <span className="text-foreground font-medium">No scheduled departures yet</span>
                    <span className="text-muted-foreground text-xs leading-[1.5]">
                      Send a quick inquiry and we&apos;ll come back with the next available group.
                    </span>
                  </div>
                )
              ) : (
                <p className="text-ink-soft border-border bg-background rounded-lg border px-4 py-3 text-sm leading-[1.5]">
                  Available year-round. You&apos;ll choose your dates and party size at the next
                  step.
                </p>
              )}
            </div>

            <Link
              href={
                isFixedWithoutDepartures
                  ? `/inquiry?tour=${tour.slug}`
                  : `/checkout?tour=${tour.slug}`
              }
              className="bg-accent-deep text-background hover:bg-accent mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[15px] font-medium transition-colors"
            >
              {isFixedWithoutDepartures ? "Request custom dates" : "Continue to booking"}
              <ArrowUpRight className="size-3.5" />
            </Link>
            <p className="text-muted-foreground mt-3 text-center text-[11px]">
              {isFixedWithoutDepartures
                ? "We respond within two business days"
                : "You won't be charged yet"}
            </p>

            <div className="border-border text-ink-soft mt-6 flex flex-col gap-2 border-t pt-5 text-xs leading-[1.5]">
              <p>· Local-owned operators</p>
              <p>· Carbon-considered itinerary</p>
              <p>· Free re-booking up to 14 days before departure</p>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function Placeholder() {
  return (
    <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]">
      <div className="text-muted-foreground absolute inset-0 flex items-center justify-center font-mono text-[12px] tracking-[0.05em] uppercase">
        [ Photograph ]
      </div>
    </div>
  );
}
