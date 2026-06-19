import Link from "next/link";
import type { Tour } from "@/lib/db/schema";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

// Soft, warm placeholder washes shown only when a tour has no hero image.
// All four stay within the cream / sage / earth family — no cool hues.
const categoryGradients: Record<Tour["category"], string> = {
  wellness: "from-[#e6dbc4] to-[#d6c7ac]",
  eco: "from-[#dde4d0] to-[#b8c6a8]",
  cultural: "from-[#ece3d2] to-[#d6c7ac]",
  adventure: "from-[#d6c7ac] to-[#b8c6a8]",
};

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  return (
    // Entrance comes from the shared Reveal system (opacity + rise, staggered by
    // grid position). Hover stays to border + title colour at 150ms — no lift,
    // no shadow jump, no image zoom — so the card reads as interactive without
    // performing.
    <Reveal index={index} className="h-full">
      <Link
        href={`/tours/${tour.slug}`}
        className="group bg-card border-border/60 hover:border-accent/50 flex h-full flex-col overflow-hidden rounded-[var(--radius)] border transition-colors duration-150"
      >
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${categoryGradients[tour.category]}`}
        >
          <SafeImage
            src={tour.heroImageUrl}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            fallback={
              <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(31,42,36,0.04)_0_12px,transparent_12px_24px)]" />
            }
          />
          <div className="border-border/40 bg-background/90 text-foreground absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
            {categoryLabel[tour.category]}
            {tour.kind === "open" && <span className="text-muted-foreground">· flexible</span>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="text-foreground group-hover:text-accent font-serif text-[22px] leading-tight tracking-[-0.01em] transition-colors duration-150">
            {tour.title}
          </h3>
          <p className="text-ink-soft line-clamp-2 text-sm leading-[1.6]">
            {tour.shortDescription}
          </p>
          <div className="border-border/60 mt-auto flex items-baseline justify-between border-t pt-4">
            <span className="text-muted-foreground text-xs">
              {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
              {tour.kind === "open" && " · per stay"}
            </span>
            <span className="text-foreground text-sm font-medium tracking-tight">
              {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
