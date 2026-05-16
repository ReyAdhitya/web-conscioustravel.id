import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Conscious Travel was started in Ubud out of frustration with how Indonesia is sold to mass tourism. We work small, slow, and local — and we'd like you to as well.",
  openGraph: {
    title: "About Conscious Travel Indonesia",
    description:
      "Conscious Travel was started in Ubud out of frustration with how Indonesia is sold to mass tourism. We work small, slow, and local — and we'd like you to as well.",
    type: "website",
  },
};

const principles = [
  {
    title: "We work with people, not vendors.",
    body: "Every operator on our list is someone we've stayed with, eaten with, and trust with our own family. We don't aggregate from APIs. There is no automated sourcing.",
  },
  {
    title: "We tell you who gets paid.",
    body: "Every itinerary has a transparent cost breakdown — who's hosting you, who's guiding you, who's driving. The shape of the trip should match the shape of the impact.",
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
      <section className="relative flex min-h-[55vh] flex-col justify-end overflow-hidden bg-gradient-to-br from-[oklch(0.78_0.06_80)] to-[oklch(0.62_0.10_45)] px-6 py-16 sm:px-12 lg:px-20">
        <Image
          src="https://images.unsplash.com/photo-1604999333679-b86d54738315?w=1800&auto=format&q=80&fit=crop"
          alt="Indonesian landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl text-white">
          <p className="mb-4 text-xs tracking-[0.25em] uppercase">About</p>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Travel that <span className="italic">gives back</span> to the place it visits.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Founded in Ubud in 2026 out of frustration with how rapidly Indonesia was being sold to
            mass tourism. We curate small, slow, locally-grounded journeys. That&apos;s the whole
            premise.
          </p>
        </div>
      </section>

      <section className="bg-background px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
              Our story
            </p>
            <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight">
              We started small <span className="text-accent italic">on purpose</span>.
            </h2>
          </div>
          <div className="prose-content text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Conscious Travel began with a list of small operators across Bali, Java, Flores, and
              Sumba whom we trusted personally — yoga teachers, sailing crews, cooking grandmothers,
              tracking guides. People who&apos;d been doing this work, well, long before tourism was
              a category.
            </p>
            <p className="mt-4">
              The instinct was simple: if you wanted to travel Indonesia in a way that wasn&apos;t
              extractive — that paid people fairly, used resources lightly, left places more whole
              than it found them — there should be a place that just makes that easy.
            </p>
            <p className="mt-4">
              That&apos;s what we&apos;re building. Slowly. Capped at small numbers per departure,
              with rooms only at lodges we know, and itineraries that prefer one extra night
              somewhere quiet over one extra checklist destination.
            </p>
          </div>
        </div>
      </section>

      <section className="border-border/50 bg-card border-y px-6 py-20 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
            How we work
          </p>
          <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Four things we&apos;re <span className="text-accent italic">stubborn</span> about.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.title} className="border-accent/30 border-l-2 pl-6">
                <p className="text-accent mb-3 text-xs tracking-[0.2em] uppercase">
                  No. {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-foreground font-serif text-2xl leading-tight tracking-tight">
                  {p.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-24 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="text-muted-foreground mb-3 text-xs tracking-[0.25em] uppercase">
            Travel with us
          </p>
          <h2 className="text-foreground font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            See if the way we travel matches the way <span className="italic">you</span> want to.
          </h2>
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
