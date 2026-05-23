import type { Metadata } from "next";
import Link from "next/link";
import { TourCard } from "@/components/tour/TourCard";
import { getFeaturedTours } from "@/lib/content/tours";
import { FieldWallpaper } from "@/components/background/FieldWallpaper";
import { TextReveal } from "@/components/motion/TextReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { CyclingHeadline } from "@/components/motion/CyclingHeadline";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sustainable & Mindful Journeys in Indonesia",
  description:
    "Curated low-impact journeys across the Indonesian archipelago. Wellness retreats, community-led stays, and slow travel with certified local operators.",
  openGraph: {
    title: "Sustainable & Mindful Journeys in Indonesia",
    description:
      "Curated low-impact journeys across the Indonesian archipelago. Wellness retreats, community-led stays, and slow travel with certified local operators.",
    type: "website",
  },
};

export default async function HomePage() {
  const featured = await getFeaturedTours();

  return (
    <>
      <section className="relative isolate -mt-16 flex min-h-screen flex-col justify-center overflow-hidden bg-[#f6f3ec] px-6 pt-24 pb-16 sm:px-8 md:-mt-24 md:justify-end md:pt-36 md:pb-24">
        <div className="absolute inset-0 z-0">
          <FieldWallpaper className="block h-full w-full" />
        </div>
        {/* Soft paper wash anchored to the text area so the cycling headline always reads */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#f6f3ec]/70 via-[#f6f3ec]/15 to-transparent md:from-[#f6f3ec]/55 md:via-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] text-center md:text-left">
          <TextReveal
            as="p"
            text="Sustainable & wellness travel · Indonesia"
            className="mb-5 text-[11px] tracking-[0.22em] text-[#1a3a2a]/75 uppercase md:mb-6 md:text-[11px] md:tracking-[0.25em]"
            stagger={0.025}
          />
          <CyclingHeadline
            className="font-serif text-[44px] leading-[1.02] tracking-[-0.02em] text-[#0f2419] sm:text-[56px] md:text-6xl lg:text-7xl xl:text-[88px]"
            italicClassName="text-[#1a3a2a]"
          />
          <Reveal delay={0.7} className="mx-auto mt-7 max-w-[520px] md:mx-0 md:mt-8 md:max-w-[560px]">
            <p className="text-[15px] leading-[1.65] text-[#1a3a2a]/85 sm:text-base md:text-lg">
              Curated low-impact journeys across the archipelago. Wellness retreats,
              community-led stays, and quiet corners off the package-tour map.
            </p>
          </Reveal>
          <Reveal
            delay={0.95}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:justify-start"
          >
            <MagneticButton>
              <Link
                href="/tours"
                className="inline-flex h-12 items-center rounded-full bg-[#0f2419] px-7 text-sm font-medium text-[#f6f3ec] shadow-lg transition-colors hover:bg-[#1a3a2a]"
              >
                Explore journeys
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/inquiry"
                className="inline-flex h-12 items-center rounded-full border border-[#0f2419] px-7 text-sm font-medium text-[#0f2419] backdrop-blur-sm transition-colors hover:bg-[#0f2419] hover:text-[#f6f3ec]"
              >
                Plan a custom trip
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">
            <div>
              <p className="text-muted-foreground mb-3 text-[11px] tracking-[0.25em] uppercase">
                Featured journeys
              </p>
              <h2 className="font-serif text-foreground text-3xl leading-[1.05] tracking-[-0.01em] sm:text-4xl md:text-[42px]">
                Slow, deliberate,{" "}
                <span className="text-accent italic">closer to home</span>.
              </h2>
            </div>
            <Link href="/tours" className="text-ink-soft hover:text-accent text-sm transition">
              View all journeys →
            </Link>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
