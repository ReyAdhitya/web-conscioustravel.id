import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/tour/TourCard";
import { getFeaturedTours } from "@/lib/content/tours";

export const metadata: Metadata = {
  title: "Sustainable & Mindful Journeys in Indonesia",
  description:
    "Curated low-impact journeys across the Indonesian archipelago — wellness retreats, community-led stays, and slow travel with certified local operators.",
  openGraph: {
    title: "Sustainable & Mindful Journeys in Indonesia",
    description:
      "Curated low-impact journeys across the Indonesian archipelago — wellness retreats, community-led stays, and slow travel with certified local operators.",
    type: "website",
  },
};

export default async function HomePage() {
  const featured = await getFeaturedTours();

  return (
    <>
      <section className="hero-bg relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
            Sustainable & wellness travel · Indonesia
          </p>
          <h1 className="text-foreground font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Travel softly.
            <br />
            <span className="text-accent italic">Indonesia, slowly.</span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
            Curated low-impact journeys across the archipelago — wellness retreats, community-led
            stays, and quiet corners off the package-tour map.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/tours">Explore journeys</Link>}
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
            <Button
              render={<Link href="/inquiry">Plan a custom trip</Link>}
              variant="ghost"
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
                Featured journeys
              </p>
              <h2 className="text-foreground font-serif text-3xl tracking-tight sm:text-4xl">
                Slow, deliberate, <span className="italic">closer to home</span>.
              </h2>
            </div>
            <Link
              href="/tours"
              className="text-muted-foreground hover:text-accent hidden text-sm transition sm:inline"
            >
              View all journeys →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
