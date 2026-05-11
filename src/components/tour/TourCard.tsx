import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/db/schema";
import { formatPrice } from "@/lib/format";

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

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition hover:border-accent/50 hover:shadow-lg"
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${categoryGradients[tour.category]}`}
      >
        {tour.heroImageUrl ? (
          <Image
            src={tour.heroImageUrl}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-[0.2em] uppercase">
          {categoryLabel[tour.category]}
          {tour.kind === "open" && (
            <span className="text-muted-foreground">· flexible dates</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-xl leading-tight tracking-tight text-foreground transition group-hover:text-accent">
          {tour.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tour.shortDescription}
        </p>
        <div className="mt-auto flex items-baseline justify-between border-t border-border/50 pt-4">
          <span className="text-xs text-muted-foreground">
            {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
            {tour.kind === "open" && " · per stay"}
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            {formatPrice(tour.basePriceMinor, tour.baseCurrency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
