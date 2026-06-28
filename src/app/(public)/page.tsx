import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedTours } from "@/lib/content/tours";
import { formatPrice } from "@/lib/format";
import type { Tour } from "@/lib/db/schema";
import { FieldWallpaper } from "@/components/background/FieldWallpaper";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { CyclingHeadline } from "@/components/motion/CyclingHeadline";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sustainable & Mindful Journeys across Asia",
  description:
    "Curated low-impact journeys across Indonesia, Vietnam, Thailand and Japan. Wellness retreats, community-led stays, and slow travel with trusted local operators.",
  openGraph: {
    title: "Sustainable & Mindful Journeys across Asia",
    description:
      "Curated low-impact journeys across Indonesia, Vietnam, Thailand and Japan. Wellness retreats, community-led stays, and slow travel with trusted local operators.",
    type: "website",
  },
};

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

// Echoes the Sustainability page — a deliberate thread between the two.
const impactStats = [
  { value: "82%", label: "of every booking stays in-country" },
  { value: "0", label: "single-use plastic on operated trips" },
  { value: "12", label: "travelers, maximum, per departure" },
  { value: "25%", label: "above regional minimum wage, every guide" },
];

export default async function HomePage() {
  const featured = await getFeaturedTours();
  const lead = featured[0];
  const secondary = featured.slice(1, 3);

  return (
    <>
      <section className="bg-hero-paper relative isolate -mt-16 flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-24 pb-16 sm:px-8 md:-mt-24 md:justify-end md:pt-36 md:pb-24">
        <div className="absolute inset-0 z-0">
          <FieldWallpaper className="block h-full w-full" />
        </div>
        {/* Soft paper wash anchored to the text area so the cycling headline always reads */}
        <div className="from-hero-paper/70 via-hero-paper/15 md:from-hero-paper/55 pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t to-transparent md:via-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] text-center md:text-left">
          <TextReveal
            as="p"
            text="Sustainable & wellness travel · Asia"
            className="text-hero-accent/75 mb-5 text-[11px] tracking-[0.22em] uppercase md:mb-6 md:text-[11px] md:tracking-[0.25em]"
            stagger={0.025}
          />
          <CyclingHeadline
            className="text-hero-ink font-serif text-[44px] leading-[1.02] tracking-[-0.02em] sm:text-[56px] md:text-6xl lg:text-7xl xl:text-[88px]"
            italicClassName="text-hero-accent"
          />
          <Reveal
            delay={0.7}
            className="mx-auto mt-7 max-w-[520px] md:mx-0 md:mt-8 md:max-w-[560px]"
          >
            <p className="text-hero-accent/85 text-[15px] leading-[1.65] sm:text-base md:text-lg">
              Curated low-impact journeys across Indonesia and beyond — Vietnam, Thailand, Japan.
              Wellness retreats, community-led stays, and quiet corners off the package-tour map.
            </p>
          </Reveal>
          <Reveal
            delay={0.95}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:justify-start"
          >
            <MagneticButton>
              <Link
                href="/tours"
                className="bg-hero-ink text-hero-paper hover:bg-hero-accent inline-flex h-12 items-center rounded-full px-7 text-sm font-medium shadow-lg transition-colors"
              >
                Explore journeys
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/inquiry"
                className="border-hero-ink text-hero-ink hover:bg-hero-ink hover:text-hero-paper inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium backdrop-blur-sm transition-colors"
              >
                Plan a custom journey
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* Featured — asymmetric editorial split: a standing masthead rail beside one lead
          journey and a quieter pair. Deliberately not three equal cards. */}
      {lead && (
        <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-36">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 lg:pt-1">
                <Reveal>
                  <p className="text-muted-foreground text-[11px] tracking-[0.25em] uppercase">
                    Featured journeys
                  </p>
                  <h2 className="text-foreground mt-5 font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-[42px]">
                    Slow, deliberate, <span className="text-accent italic">closer to home</span>.
                  </h2>
                  <p className="text-ink-soft mt-5 max-w-[42ch] text-[15px] leading-[1.7]">
                    A short, changing shelf of the journeys we&apos;re paying attention to right now
                    — chosen for the people who host them, not the boxes they tick.
                  </p>
                  <Link
                    href="/tours"
                    className="text-foreground hover:text-accent group mt-8 inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <span className="border-foreground/30 group-hover:border-accent border-b pb-1 transition-colors">
                      View all journeys
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </Reveal>
              </div>

              <div className="flex flex-col gap-12 sm:gap-14 lg:col-span-8">
                <Reveal>
                  <LeadFeature tour={lead} />
                </Reveal>
                {secondary.length > 0 && (
                  <Reveal delay={0.08}>
                    <div className="border-border/70 grid gap-10 border-t pt-12 sm:grid-cols-2 sm:gap-8">
                      {secondary.map((tour) => (
                        <SecondaryFeature key={tour.id} tour={tour} />
                      ))}
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sustainability teaser — a dark editorial band, left-weighted, punctuated by
          oversized figures. The structural counterweight to the cream sections. */}
      <section className="bg-accent-deep text-background">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="text-background/55 text-[11px] tracking-[0.25em] uppercase">
                Why we travel this way
              </p>
              <h2 className="mt-6 font-serif text-3xl leading-[1.08] tracking-[-0.025em] sm:text-4xl lg:text-[46px]">
                Every booking has to leave the place{" "}
                <span className="text-background/80 italic">better than we found it</span>.
              </h2>
              <p className="text-background/70 mt-7 max-w-[48ch] text-[15px] leading-[1.7] sm:text-base">
                We measure where the money goes, who gets paid, and what each itinerary costs the
                ground it crosses. Not a marketing badge — a constraint we&apos;ve accepted, and
                publish.
              </p>
              <Link
                href="/sustainability"
                className="border-background/40 hover:border-background mt-9 inline-flex items-center gap-2 border-b pb-1 text-sm font-medium transition-colors"
              >
                Read our commitments <span aria-hidden>→</span>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-10">
                {impactStats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-serif text-4xl tracking-[-0.02em] sm:text-5xl">
                      {s.value}
                    </dt>
                    <dd className="text-background/60 mt-2 text-[13px] leading-[1.5]">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Inquiry CTA — left-weighted, heading and action held apart across the measure.
          No centered hero-CTA stack. */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-36">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <div className="border-border grid gap-10 border-t pt-12 sm:pt-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
              <div>
                <p className="text-muted-foreground text-[11px] tracking-[0.25em] uppercase">
                  Or shape your own
                </p>
                <h2 className="text-foreground mt-5 max-w-[16ch] font-serif text-3xl leading-[1.04] tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                  Tell us what you&apos;re <span className="text-accent italic">imagining</span>.
                </h2>
              </div>
              <div className="flex flex-col items-start gap-6 lg:items-end">
                <p className="text-ink-soft max-w-[36ch] text-[15px] leading-[1.7] sm:text-base lg:text-right">
                  A quieter itinerary, a longer stay, a route off the map — we&apos;ll plan it with
                  the people who actually know the ground.
                </p>
                <div className="flex flex-wrap gap-3">
                  <MagneticButton>
                    <Link
                      href="/inquiry"
                      className="bg-accent-deep text-background hover:bg-accent inline-flex h-12 items-center rounded-full px-7 text-sm font-medium transition-colors"
                    >
                      Plan a custom journey
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <Link
                      href="/tours"
                      className="border-border text-foreground hover:bg-bg-soft inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors"
                    >
                      Explore journeys
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function LeadFeature({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <div className="bg-bg-soft relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius)]">
        <SafeImage
          src={tour.heroImageUrl}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="object-cover transition-[filter] duration-500 group-hover:brightness-[1.03]"
          fallback={<Placeholder />}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
            {categoryLabel[tour.category]}
            {tour.kind === "open" && " · flexible dates"}
          </p>
          <h3 className="text-foreground group-hover:text-accent mt-3 font-serif text-3xl leading-[1.05] tracking-[-0.02em] transition-colors sm:text-4xl">
            {tour.title}
          </h3>
          <p className="text-ink-soft mt-3 max-w-[46ch] text-[15px] leading-[1.7]">
            {tour.shortDescription}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <div className="text-muted-foreground text-[11px] tracking-[0.08em] uppercase">From</div>
          <div className="text-foreground mt-1 font-serif text-2xl tracking-[-0.01em]">
            {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SecondaryFeature({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group block">
      <div className="bg-bg-soft relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius)]">
        <SafeImage
          src={tour.heroImageUrl}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-[filter] duration-500 group-hover:brightness-[1.03]"
          fallback={<Placeholder />}
        />
      </div>
      <p className="text-muted-foreground mt-4 text-[11px] tracking-[0.2em] uppercase">
        {categoryLabel[tour.category]}
      </p>
      <h3 className="text-foreground group-hover:text-accent mt-2 font-serif text-xl leading-tight tracking-[-0.01em] transition-colors sm:text-2xl">
        {tour.title}
      </h3>
      <div className="border-border/60 text-muted-foreground mt-4 flex items-baseline justify-between border-t pt-3 text-xs">
        <span>
          {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
          {tour.kind === "open" && " · per stay"}
        </span>
        <span className="text-foreground text-sm font-medium tracking-tight">
          {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
        </span>
      </div>
    </Link>
  );
}

function Placeholder() {
  return (
    <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]" />
  );
}
