import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getAllTours, getTourBySlug } from "@/lib/content/tours";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";

const categoryGradients: Record<Tour["category"], string> = {
  wellness: "from-[oklch(0.78_0.06_80)] to-[oklch(0.62_0.10_45)]",
  eco: "from-[oklch(0.72_0.08_140)] to-[oklch(0.50_0.08_120)]",
  cultural: "from-[oklch(0.78_0.08_55)] to-[oklch(0.55_0.12_30)]",
  adventure: "from-[oklch(0.70_0.10_220)] to-[oklch(0.45_0.10_240)]",
};

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

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

  return (
    <>
      <section
        className={`relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-gradient-to-br px-6 py-16 sm:px-12 lg:px-20 ${categoryGradients[tour.category]}`}
      >
        {tour.heroImageUrl && (
          <Image
            src={tour.heroImageUrl}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-neutral-900 uppercase">
            {categoryLabel[tour.category]}
            {tour.kind === "open" && <span className="text-neutral-600">· flexible dates</span>}
          </div>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {tour.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {tour.shortDescription}
          </p>
        </div>
      </section>

      <section className="bg-background px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-serif text-2xl tracking-tight text-foreground">About this journey</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {tour.longDescription}
              </p>
            </div>

            {tour.itinerary.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl tracking-tight text-foreground">Day by day</h2>
                <ol className="mt-6 flex flex-col gap-6">
                  {tour.itinerary.map((day) => (
                    <li
                      key={day.day}
                      className="grid gap-2 border-l-2 border-accent/40 pl-6 sm:grid-cols-[80px_1fr] sm:gap-6 sm:border-l-0 sm:pl-0"
                    >
                      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground sm:text-right">
                        Day {day.day}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{day.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {day.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  What&apos;s included
                </h3>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-foreground">
                  {tour.inclusions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {tour.exclusions.length > 0 && (
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Not included
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span>·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">From</p>
              <p className="mt-1 font-serif text-3xl tracking-tight text-foreground">
                {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                per person · {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
                {tour.kind === "open" && " · per stay"}
              </p>

              <div className="my-6 border-t border-border/60" />

              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5 text-xs tracking-wide text-muted-foreground">
                  {tour.kind === "fixed" ? "Choose departure" : "Preferred start date"}
                  <select
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    defaultValue=""
                    disabled
                  >
                    <option value="">— departures load when DB is wired —</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs tracking-wide text-muted-foreground">
                  Travelers
                  <input
                    type="number"
                    min={tour.minPax}
                    max={tour.maxPax}
                    defaultValue={tour.minPax}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </label>
              </div>

              <Button
                render={<Link href={`/checkout?tour=${tour.slug}`}>Continue to booking</Link>}
                className="mt-6 h-12 w-full rounded-full text-sm tracking-wide"
              />
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                You won&apos;t be charged yet
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 px-2 text-xs text-muted-foreground">
              <p>· Local-owned operators</p>
              <p>· Carbon-considered itinerary</p>
              <p>· Free re-booking up to 14 days before departure</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
