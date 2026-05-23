import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Five commitments that shape every Conscious Travel journey. From carbon and plastic to fair wages, local ownership, and regenerative impact projects.",
  openGraph: {
    title: "Sustainability · Conscious Travel Indonesia",
    description:
      "Five commitments that shape every Conscious Travel journey. From carbon and plastic to fair wages, local ownership, and regenerative impact projects.",
    type: "website",
  },
};

const commitments = [
  {
    label: "Carbon",
    title: "Carbon-considered itineraries.",
    body: "We design routes to minimise internal flights and group movements logistically. We're transparent about each itinerary's carbon profile and contribute to verified reforestation per traveler.",
  },
  {
    label: "Local ownership",
    title: "More than 80% of every booking stays in Indonesia.",
    body: "We measure this. Lodges are family-run or co-operatively owned, guides are local, food is sourced regionally. We publish a transparent split per itinerary.",
  },
  {
    label: "Plastic",
    title: "Zero single-use plastic on operated trips.",
    body: "Refillable bottles at every stop, reusable utensils for picnic days, partnership with operators who've committed to the same. It's not a slogan, it's a checklist we maintain.",
  },
  {
    label: "Fair wages",
    title: "Above provincial minimum, every guide, every cook.",
    body: "We pay our partners a published rate that's at least 25% above the regional minimum wage. Tipping is included so the experience isn't structured around traveler discretion.",
  },
  {
    label: "Regenerative",
    title: "Every booking funds a place-based project.",
    body: "Reef restoration in Komodo. Reforestation in the Sidemen valley. Mangrove planting on Sumba. The project is matched to the places your itinerary touches.",
  },
];

const stats = [
  { value: "82%", label: "of every booking stays in-country" },
  { value: "0", label: "single-use plastic items per operated trip" },
  { value: "12", label: "max travelers per group departure" },
  { value: "5+", label: "regenerative projects funded year-to-date" },
];

export default function SustainabilityPage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden bg-gradient-to-br from-[oklch(0.72_0.08_140)] to-[oklch(0.50_0.08_120)] px-6 py-16 sm:px-12 lg:px-20">
        <Image
          src="https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=1800&auto=format&q=80&fit=crop"
          alt="Indonesian landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl text-white">
          <p className="mb-4 text-xs tracking-[0.25em] uppercase">Sustainability</p>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            We don&apos;t sell <span className="italic">sustainable travel</span>.
            <br />
            We make it harder to travel any other way.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Five concrete commitments. Measured, published, and audited every quarter. Not a
            marketing badge. A constraint we&apos;ve accepted.
          </p>
        </div>
      </section>

      <section className="bg-background px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-foreground font-serif text-4xl tracking-tight sm:text-5xl">
                  {s.value}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border/50 bg-card border-t px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
            Our commitments
          </p>
          <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Five things we promise. <span className="text-accent italic">Every trip.</span>
          </h2>
          <div className="mt-16 flex flex-col gap-16">
            {commitments.map((c, i) => (
              <div
                key={c.title}
                className="border-border/50 grid gap-6 border-t pt-10 sm:grid-cols-[140px_1fr] sm:gap-12"
              >
                <div>
                  <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                    {String(i + 1).padStart(2, "0")} · {c.label}
                  </p>
                </div>
                <div>
                  <h3 className="text-foreground font-serif text-2xl leading-tight tracking-tight sm:text-3xl">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
            How we measure
          </p>
          <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            We publish what we know. <span className="text-accent italic">And what we don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg">
            Sustainability claims in travel are mostly marketing. We&apos;re trying to do something
            different. Publish actual numbers, audit them quarterly, and be honest about where we
            still fall short. The first quarterly report drops in late 2026; subscribe below if
            you&apos;d like a copy.
          </p>
          <div className="border-border/50 mt-10 rounded-xl border bg-card p-6">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Annual transparency report
            </p>
            <p className="text-foreground mt-2 font-serif text-xl tracking-tight">
              Coming late 2026.
            </p>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Operator pay rates, carbon estimates per itinerary, a list of every regenerative
              project we&apos;ve funded, including the ones that didn&apos;t work. Free to read.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Travel that <span className="italic">earns its place</span>.
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Browse journeys built around these commitments, or tell us what you&apos;re imagining.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/tours">Browse journeys</Link>}
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
    </>
  );
}
