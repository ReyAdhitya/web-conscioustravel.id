import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Maximize2, ArrowUpRight } from "lucide-react";
import { getAllTours, getTourBySlug } from "@/lib/content/tours";
import { getUpcomingDeparturesByTourId } from "@/lib/departures/store";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";

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

const placeholderTints = [
  "bg-[#ece3d2]",
  "bg-[#e2d6bf]",
  "bg-[#d6c7ac]",
  "bg-[#e6dbc4]",
  "bg-[#dccbb0]",
];

function isValidUrl(url: string) {
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

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const departures = await getUpcomingDeparturesByTourId(tour.id);
  const isFixedWithoutDepartures = tour.kind === "fixed" && departures.length === 0;

  const validHero = tour.heroImageUrl && isValidUrl(tour.heroImageUrl) ? tour.heroImageUrl : null;
  const gallery = (tour.galleryImageUrls ?? []).filter(isValidUrl);
  const sideImages = gallery.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8">
      <header className="flex flex-col gap-6 pt-8 pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <div className="text-ink-soft mb-3.5 inline-flex items-center gap-2 text-[13px]">
            <span className="bg-foreground/95 text-background inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-[0.18em] uppercase">
              {categoryLabel[tour.category]}
              {tour.kind === "open" && <span className="opacity-70">· flexible dates</span>}
            </span>
          </div>
          <h1 className="font-serif text-[44px] leading-none tracking-[-0.015em] sm:text-[56px] md:text-[64px]">
            {tour.title}
          </h1>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-muted-foreground text-xs tracking-[0.08em] uppercase">From</div>
          <div className="font-serif mt-1 text-3xl">
            {formatPrice(tour.basePriceMinor, tour.baseCurrency)}{" "}
            <span className="text-muted-foreground ml-1.5 font-sans text-sm">
              · {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>
      </header>

      <section
        className="mt-2 grid h-[460px] grid-cols-1 grid-rows-[200px_200px_200px] gap-2.5 md:h-[540px] md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2"
        aria-label="Photo gallery"
      >
        <div className="relative col-span-1 overflow-hidden rounded-[var(--radius)] md:row-span-2">
          {validHero ? (
            <Image
              src={validHero}
              alt={tour.title}
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          ) : (
            <PlaceholderCell tint={placeholderTints[0]} label="[ Hero shot ]" />
          )}
        </div>
        {[0, 1, 2, 3].map((i) => {
          const src = sideImages[i];
          return (
            <div key={i} className="relative overflow-hidden rounded-[var(--radius)]">
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderCell tint={placeholderTints[i + 1]} label={`[ Photo ${i + 1} ]`} />
              )}
              {i === 3 && (
                <button
                  type="button"
                  className="text-foreground absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                >
                  See all photos
                  <Maximize2 className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </section>

      <section className="mt-20 grid gap-16 pb-30 md:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-serif mb-9 max-w-[520px] text-[36px] leading-[1.05] tracking-[-0.01em] sm:text-[42px] md:text-5xl">
            About this <em className="text-accent italic">journey</em>
          </h2>

          <p className="text-ink-soft mb-12 max-w-[620px] text-[16px] leading-[1.7]">
            {tour.longDescription}
          </p>

          {tour.itinerary.length > 0 && (
            <div className="border-border max-w-[620px] border-t pt-10">
              <h3 className="font-serif mb-8 text-3xl tracking-[-0.01em]">Day by day</h3>
              <ol className="flex flex-col gap-6">
                {tour.itinerary.map((day) => (
                  <li
                    key={day.day}
                    className="grid grid-cols-[60px_1fr] gap-5 sm:grid-cols-[88px_1fr] sm:gap-7"
                  >
                    <div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      Day {day.day}
                    </div>
                    <div>
                      <h4 className="font-serif text-foreground text-lg tracking-[-0.005em]">
                        {day.title}
                      </h4>
                      <p className="text-ink-soft mt-1.5 text-[14.5px] leading-[1.65]">
                        {day.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="border-border mt-10 grid max-w-[620px] gap-10 border-t pt-10 sm:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground mb-4 text-[11px] tracking-[0.18em] uppercase">
                What&apos;s included
              </h3>
              <ul className="flex flex-col gap-2.5">
                {tour.inclusions.map((item) => (
                  <li key={item} className="text-ink-soft flex gap-2 text-[14.5px] leading-[1.55]">
                    <span className="text-accent">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {tour.exclusions.length > 0 && (
              <div>
                <h3 className="text-muted-foreground mb-4 text-[11px] tracking-[0.18em] uppercase">
                  Not included
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {tour.exclusions.map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex gap-2 text-[14.5px] leading-[1.55]"
                    >
                      <span>·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <aside className="bg-card self-start rounded-[var(--radius)] p-8 md:sticky md:top-32">
          <p className="text-muted-foreground text-xs tracking-[0.08em] uppercase">From</p>
          <p className="font-serif mt-1 text-3xl tracking-[-0.005em]">
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
                  <ul className="border-border divide-border/60 divide-y rounded-lg border bg-background">
                    {departures.slice(0, 4).map((dep) => {
                      const spotsLeft = dep.capacity - dep.bookedCount;
                      const soldOut = dep.status === "sold_out" || spotsLeft <= 0;
                      return (
                        <li
                          key={dep.id}
                          className="flex items-center justify-between px-3 py-2.5 text-sm"
                        >
                          <span className="text-foreground">
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
              <label className="text-muted-foreground flex flex-col gap-1.5 text-xs tracking-wide">
                Preferred start date
                <input
                  type="date"
                  className="border-border bg-background text-foreground rounded-lg border px-3 py-2.5 text-sm"
                />
              </label>
            )}

            <label className="text-muted-foreground flex flex-col gap-1.5 text-xs tracking-wide">
              Travelers
              <input
                type="number"
                min={tour.minPax}
                max={tour.maxPax}
                defaultValue={tour.minPax}
                className="border-border bg-background text-foreground rounded-lg border px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <Link
            href={
              isFixedWithoutDepartures ? `/inquiry?tour=${tour.slug}` : `/checkout?tour=${tour.slug}`
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

          <div className="border-border text-ink-soft mt-6 flex flex-col gap-2 border-t pt-5 text-xs">
            <p>· Local-owned operators</p>
            <p>· Carbon-considered itinerary</p>
            <p>· Free re-booking up to 14 days before departure</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PlaceholderCell({ tint, label }: { tint: string; label: string }) {
  return (
    <div className={`absolute inset-0 ${tint}`}>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]" />
      <div className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-[12px] tracking-[0.05em] text-[#5a5448] uppercase">
        {label}
      </div>
    </div>
  );
}
