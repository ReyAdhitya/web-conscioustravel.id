import Link from "next/link";
import type { Metadata } from "next";

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
      {/* Masthead — the manifesto opens in type, not in a photographed overlay. */}
      <section className="px-6 pt-16 pb-12 sm:px-12 sm:pt-24 lg:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-muted-foreground text-[11px] tracking-[0.25em] uppercase">
            Sustainability
          </p>
          <h1 className="mt-7 max-w-[14ch] font-serif text-[44px] leading-[0.98] tracking-[-0.03em] sm:text-[64px] lg:text-[80px]">
            We don&apos;t sell <span className="italic">sustainable travel</span>.
          </h1>
          <p className="text-accent mt-3 max-w-[20ch] font-serif text-2xl leading-[1.1] tracking-[-0.02em] italic sm:text-3xl lg:text-4xl">
            We make it harder to travel any other way.
          </p>
          <p className="text-ink-soft mt-8 max-w-[560px] text-lg leading-[1.7]">
            Five concrete commitments. Measured, published, and audited every quarter. Not a
            marketing badge — a constraint we&apos;ve accepted.
          </p>
        </div>
      </section>

      {/* Stat band — oversized figures, the stat-led signature of the page. */}
      <section className="px-6 sm:px-12 lg:px-20">
        <div className="border-border mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-8 gap-y-12 border-y py-12 sm:grid-cols-4 sm:py-16">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-foreground font-serif text-5xl leading-none tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                {s.value}
              </p>
              <p className="text-muted-foreground mt-4 max-w-[22ch] text-sm leading-[1.5]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Commitments — numbered declarations, broken once by an inline pull-quote. */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-[640px]">
            <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
              Our commitments
            </p>
            <h2 className="text-foreground mt-5 font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              Five things we promise. <span className="text-accent italic">Every trip.</span>
            </h2>
          </div>

          <div className="mt-14 flex flex-col sm:mt-16">
            {commitments.map((c, i) => (
              <div key={c.title}>
                <div className="border-border grid gap-6 border-t py-12 sm:grid-cols-[1fr_1.7fr] sm:gap-12 sm:py-14">
                  <div>
                    <p className="text-foreground font-serif text-5xl leading-none tracking-[-0.03em] tabular-nums sm:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="text-muted-foreground mt-4 text-[11px] tracking-[0.2em] uppercase">
                      {c.label}
                    </p>
                  </div>
                  <div className="max-w-[52ch]">
                    <h3 className="text-foreground font-serif text-2xl leading-[1.12] tracking-[-0.02em] sm:text-[32px]">
                      {c.title}
                    </h3>
                    <p className="text-ink-soft mt-4 text-[15.5px] leading-[1.75]">{c.body}</p>
                  </div>
                </div>

                {/* A single centered pull-quote, set mid-list for editorial rhythm. */}
                {i === 2 && (
                  <figure className="border-border border-t py-16 text-center sm:py-20">
                    <blockquote className="mx-auto max-w-[24ch]">
                      <p className="text-foreground font-serif text-[28px] leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-[44px]">
                        We&apos;d rather publish the number than print the{" "}
                        <span className="text-accent italic">badge</span>.
                      </p>
                    </blockquote>
                  </figure>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we measure — asymmetric split, heading held left, body and report card right. */}
      <section className="border-border bg-card border-t px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20">
          <div className="max-w-[440px]">
            <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
              How we measure
            </p>
            <h2 className="text-foreground mt-5 font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              We publish what we know.{" "}
              <span className="text-accent italic">And what we don&apos;t.</span>
            </h2>
          </div>
          <div className="max-w-[560px]">
            <p className="text-ink-soft text-[16px] leading-[1.8]">
              Sustainability claims in travel are mostly marketing. We&apos;re trying to do
              something different. Publish actual numbers, audit them quarterly, and be honest about
              where we still fall short. The first quarterly report drops in late 2026; subscribe
              below if you&apos;d like a copy.
            </p>
            <div className="border-border bg-background mt-8 rounded-[var(--radius)] border p-6 sm:p-7">
              <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
                Annual transparency report
              </p>
              <p className="text-foreground mt-2 font-serif text-xl tracking-[-0.01em]">
                Coming late 2026.
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-[1.6]">
                Operator pay rates, carbon estimates per itinerary, a list of every regenerative
                project we&apos;ve funded, including the ones that didn&apos;t work. Free to read.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Close — left-aligned, matching the manifesto's voice rather than a centered sign-off. */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-[640px]">
            <h2 className="text-foreground max-w-[18ch] font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              Travel that <span className="text-accent italic">earns its place</span>.
            </h2>
            <p className="text-ink-soft mt-5 max-w-[52ch] text-base leading-[1.7]">
              Browse journeys built around these commitments, or tell us what you&apos;re imagining.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/tours"
                className="bg-accent-deep text-background hover:bg-accent inline-flex h-12 items-center rounded-full px-7 text-sm font-medium transition-colors"
              >
                Browse journeys
              </Link>
              <Link
                href="/inquiry"
                className="border-border text-foreground hover:bg-bg-soft inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors"
              >
                Plan a custom trip
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
