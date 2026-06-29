import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Conscious Travel was started in Ubud out of frustration with how Indonesia is sold to mass tourism. We work small, slow, and local, and we'd like you to as well.",
  openGraph: {
    title: "About Conscious Travel Indonesia",
    description:
      "Conscious Travel was started in Ubud out of frustration with how Indonesia is sold to mass tourism. We work small, slow, and local, and we'd like you to as well.",
    type: "website",
  },
};

// Authentic photos from the team's real journeys (extracted from the company
// profile). Files live under /public/images/about/.
const journeyPhotos = [
  { src: "/images/about/01-komodo.jpg", alt: "A Komodo dragon on Flores" },
  { src: "/images/about/02-cultural-dance.jpg", alt: "A traditional dance performance" },
  { src: "/images/about/03-swiss-train.jpg", alt: "A scenic rail journey through the Alps" },
  { src: "/images/about/04-paris-eiffel.jpg", alt: "Travellers at the Eiffel Tower, Paris" },
  { src: "/images/about/05-prague-trams.jpg", alt: "Trams in the streets of Prague" },
  { src: "/images/about/06-netherlands-windmill.jpg", alt: "A group by the windmills of the Netherlands" },
  { src: "/images/about/07-team-building.jpg", alt: "A team-building day outdoors" },
  { src: "/images/about/08-community-kids.jpg", alt: "Time with children from a local community" },
  { src: "/images/about/09-scuba-diving.jpg", alt: "Diving a coral reef" },
  { src: "/images/about/10-spain-flamenco.jpg", alt: "A flamenco performance in Spain" },
  { src: "/images/about/11-thailand-muaythai.jpg", alt: "A Muay Thai match in Thailand" },
  { src: "/images/about/12-weaving-craft.jpg", alt: "Traditional hand-weaving" },
  { src: "/images/about/13-sunset-dinner.jpg", alt: "A group dinner at sunset" },
  { src: "/images/about/14-forest-group.jpg", alt: "A group walking together through the forest" },
  { src: "/images/about/15-beach-group.jpg", alt: "On the beach together" },
  { src: "/images/about/16-coastal-cliffs.jpg", alt: "Walking a stretch of coastal cliffs" },
];

const principles = [
  {
    title: "We work with people, not vendors.",
    body: "Every operator on our list is someone we've stayed with, eaten with, and trust with our own family. We don't aggregate from APIs. There is no automated sourcing.",
  },
  {
    title: "We tell you who gets paid.",
    body: "Every itinerary has a transparent cost breakdown. Who's hosting you, who's guiding you, who's driving. The shape of the trip should match the shape of the impact.",
  },
  {
    title: "We say no often.",
    body: "Some itineraries we're asked to plan, we won't. Some destinations we deliberately stay out of in peak months. Saying no is part of the job.",
  },
  {
    title: "We design for fewer trips, longer stays.",
    body: "The math of low-impact travel says: take fewer flights, stay longer, go deeper. Our itineraries quietly nudge that direction without lecturing.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Masthead — set as the opening of a letter, on cream, no photographic overlay. */}
      <section className="px-6 pt-16 pb-12 sm:px-12 sm:pt-24 lg:px-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-muted-foreground flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase">
            <span>About</span>
            <span className="bg-border h-px w-8" aria-hidden />
            <span>Ubud, Bali</span>
          </div>
          <h1 className="mt-7 max-w-[18ch] font-serif text-[44px] leading-[1.0] tracking-[-0.03em] sm:text-[60px] lg:text-[72px]">
            Travel that <span className="text-accent italic">gives back</span> to the place it
            visits.
          </h1>
          <p className="text-ink-soft mt-8 max-w-[600px] text-lg leading-[1.7]">
            Founded in Ubud in 2026, out of frustration with how rapidly Indonesia was being sold to
            mass tourism. We curate small, slow, locally-grounded journeys. That&apos;s the whole
            premise.
          </p>
        </div>
      </section>

      {/* The letter — a single narrow reading column, the spine of the page. */}
      <section className="px-6 pb-20 sm:px-12 sm:pb-28 lg:px-20 lg:pb-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="border-border max-w-[680px] border-t pt-12">
            <p className="text-muted-foreground mb-7 text-[11px] tracking-[0.22em] uppercase">
              Our story
            </p>
            <div className="text-ink-soft space-y-5 text-[16px] leading-[1.8]">
              <p className="first-letter:text-accent first-letter:float-left first-letter:m-0 first-letter:mr-3 first-letter:font-serif first-letter:text-[3.4rem] first-letter:leading-[0.78]">
                Conscious Travel began with a list of small operators across Bali, Java, Flores, and
                Sumba whom we trusted personally. Yoga teachers, sailing crews, cooking
                grandmothers, tracking guides. People who&apos;d been doing this work, well, long
                before tourism was a category.
              </p>
              <p>
                The instinct was simple: if you wanted to travel Indonesia in a way that wasn&apos;t
                extractive, that paid people fairly, used resources lightly, left places more whole
                than it found them, there should be a place that just makes that easy.
              </p>
              <p>
                That&apos;s what we&apos;re building. Slowly. Capped at small numbers per departure,
                with rooms only at lodges we know, and itineraries that prefer one extra night
                somewhere quiet over one extra checklist destination.
              </p>
            </div>
            <p className="text-foreground mt-10 font-serif text-xl tracking-[-0.01em] italic">
              — The Conscious Travel team
            </p>
          </div>
        </div>
      </section>

      {/* A single full-bleed plate — image freed from any card border. */}
      <section className="px-6 sm:px-12 lg:px-20">
        <figure className="mx-auto w-full max-w-7xl">
          <div className="bg-bg-soft relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-xl)] sm:aspect-[2/1]">
            <Image
              src="/images/about/16-coastal-cliffs.jpg"
              alt="A coastline on one of our journeys"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="text-muted-foreground mt-4 max-w-[680px] text-xs leading-[1.6] tracking-[0.02em]">
            The kind of quiet, unhurried coastline our itineraries are built around — far from the
            crowds, close to the place.
          </figcaption>
        </figure>
      </section>

      {/* How we work — numbered convictions, kept inside the letter's left-aligned spine. */}
      <section className="px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-36">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-[680px]">
            <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
              How we work
            </p>
            <h2 className="text-foreground mt-5 font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              Four things we&apos;re <span className="text-accent italic">stubborn</span> about.
            </h2>
          </div>
          <ol className="mt-12 max-w-[760px] sm:mt-16">
            {principles.map((p, i) => (
              <li key={p.title} className="border-border border-t py-9 first:border-t-0 first:pt-0">
                <p className="text-accent text-[11px] tracking-[0.2em] uppercase">
                  No. {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-foreground mt-3 max-w-[24ch] font-serif text-2xl leading-[1.12] tracking-[-0.015em]">
                  {p.title}
                </h3>
                <p className="text-ink-soft mt-3 max-w-[58ch] text-[15px] leading-[1.75]">
                  {p.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* From our journeys — authentic photographs from real trips. */}
      <section className="border-border border-t px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-[680px]">
            <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
              From our journeys
            </p>
            <h2 className="text-foreground mt-5 max-w-[22ch] font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              Real trips, real people, <span className="text-accent italic">across the world</span>.
            </h2>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {journeyPhotos.map((photo) => (
              <li
                key={photo.src}
                className="bg-bg-soft relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close — left-aligned, the letter signing off rather than a centered CTA. */}
      <section className="border-border border-t px-6 py-20 sm:px-12 sm:py-28 lg:px-20 lg:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-[680px]">
            <p className="text-muted-foreground text-[11px] tracking-[0.22em] uppercase">
              Travel with us
            </p>
            <h2 className="text-foreground mt-5 max-w-[20ch] font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              See if the way we travel matches the way <span className="italic">you</span> want to.
            </h2>
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
