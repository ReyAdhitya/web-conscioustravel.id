import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Stays",
  description:
    "Boutique stays curated by Conscious Travel. Small, locally-run properties chosen for craft, integrity, and a strong sense of place.",
};

const stays = [
  {
    slug: "the-mangrove-house",
    name: "The Mangrove House",
    location: "Bali, Indonesia",
    blurb:
      "A small boutique retreat tucked between mangrove forest and the Indian Ocean. Natural materials, generous light, ocean view.",
    price: "IDR 4,249K",
    pricePer: "per night",
    tints: ["bg-[#ece3d2]", "bg-[#e2d6bf]", "bg-[#d6c7ac]"],
  },
];

export default function StaysIndexPage() {
  return (
    <>
      <section className="border-border/60 border-b px-6 py-20 sm:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="text-muted-foreground mb-4 text-[11px] tracking-[0.25em] uppercase">
            Stays
          </p>
          <h1 className="font-serif text-[44px] leading-[1.02] tracking-[-0.015em] sm:text-[56px] md:text-[64px]">
            Places to <span className="text-accent italic">slow down</span> in.
          </h1>
          <p className="text-ink-soft mt-7 max-w-[620px] text-base leading-[1.65] sm:text-lg">
            A small, opinionated collection of boutique stays. Each one is family-run or
            co-operatively owned, designed around the land rather than around the road.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-2">
            {stays.map((stay) => (
              <Link
                key={stay.slug}
                href={`/stays/${stay.slug}`}
                className="group bg-card border-border/60 hover:border-accent/40 flex flex-col overflow-hidden rounded-[var(--radius)] border transition-colors"
              >
                <div className="relative grid aspect-[16/10] grid-cols-3 gap-1.5 overflow-hidden p-1.5">
                  {stay.tints.map((tint, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-[14px] ${tint}`}>
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                      {stay.location}
                    </p>
                    <h2 className="font-serif text-foreground group-hover:text-accent mt-2 text-[28px] leading-[1.1] tracking-[-0.01em] transition-colors">
                      {stay.name}
                    </h2>
                  </div>
                  <p className="text-ink-soft text-[15px] leading-[1.6]">{stay.blurb}</p>
                  <div className="border-border/60 mt-auto flex items-center justify-between border-t pt-5">
                    <div>
                      <p className="text-muted-foreground text-[11px] tracking-[0.08em] uppercase">
                        From
                      </p>
                      <p className="font-serif text-foreground mt-0.5 text-xl">
                        {stay.price}{" "}
                        <span className="text-muted-foreground text-xs font-sans">
                          / {stay.pricePer}
                        </span>
                      </p>
                    </div>
                    <span className="text-accent inline-flex items-center gap-1 text-sm font-medium">
                      View stay
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming-soon placeholder card */}
            <div className="bg-card/50 border-border/60 flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-[var(--radius)] border-2 border-dashed p-10 text-center">
              <p className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                Coming soon
              </p>
              <p className="font-serif text-foreground text-2xl tracking-[-0.01em]">
                More stays in curation
              </p>
              <p className="text-ink-soft max-w-sm text-sm leading-[1.55]">
                We&apos;re currently visiting properties across Sumba, Flores, and East Java.
                Subscribe below for first access.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
