"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Tour } from "@/lib/db/schema";
import { formatPrice } from "@/lib/format";

const categoryGradients: Record<Tour["category"], string> = {
  wellness: "from-[#e6dbc4] to-[#d6c7ac]",
  eco: "from-[#dde4d0] to-[#b8c6a8]",
  cultural: "from-[#ece3d2] to-[#d6c7ac]",
  adventure: "from-[#d2dadd] to-[#a7b5b8]",
};

const categoryLabel: Record<Tour["category"], string> = {
  wellness: "Wellness",
  eco: "Eco",
  cultural: "Cultural",
  adventure: "Adventure",
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index, 4) * 0.08,
      }}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <Link
        href={`/tours/${tour.slug}`}
        className="group bg-card border-border/60 hover:border-accent/40 flex flex-col overflow-hidden rounded-[var(--radius)] border transition-colors hover:shadow-[0_8px_28px_rgba(31,42,36,0.08)]"
      >
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 1.05,
            ease: [0.65, 0, 0.35, 1],
            delay: Math.min(index, 4) * 0.08 + 0.1,
          }}
          className={`relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${categoryGradients[tour.category]}`}
        >
          {tour.heroImageUrl && isValidUrl(tour.heroImageUrl) ? (
            <Image
              src={tour.heroImageUrl}
              alt={tour.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.025)_0_12px,transparent_12px_24px)]" />
          )}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-[#1f2a24] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {categoryLabel[tour.category]}
            {tour.kind === "open" && <span className="text-muted-foreground">· flexible</span>}
          </div>
        </motion.div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-serif text-foreground group-hover:text-accent text-[22px] leading-tight tracking-[-0.01em] transition-colors">
            {tour.title}
          </h3>
          <p className="text-ink-soft line-clamp-2 text-[14.5px] leading-[1.6]">
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
    </motion.div>
  );
}
