import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import styles from "./stays.module.css";

export const metadata: Metadata = {
  title: "The Mangrove House · Stays",
  description:
    "A small boutique retreat tucked between mangrove forest and the Indian Ocean. Natural materials, generous light, and nothing in the way of the view.",
};

const specs = [
  {
    label: "129 sqm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x={3} y={3} width={18} height={18} rx={2} />
      </svg>
    ),
  },
  {
    label: "Up to 2 guests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx={9} cy={8} r={3} />
        <circle cx={17} cy={9} r={2} />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 2-4 4-4s2 1 2 2" />
      </svg>
    ),
  },
  {
    label: "Ocean view",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M2 16s3-2 10-2 10 2 10 2M2 20h20M6 12V8a6 6 0 0112 0v4" />
      </svg>
    ),
  },
  {
    label: "Garden view",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 2v8M8 6l4-4 4 4M5 22c2 0 3-1 3-3M11 22c2 0 3-1 3-3M17 22c2 0 3-1 3-3" />
      </svg>
    ),
  },
  {
    label: "Mangrove view",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 21c4-4 8-4 12 0M3 16c4-4 8-4 12 0M3 11c4-4 8-4 12 0" />
      </svg>
    ),
  },
  {
    label: "Queen bed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M2 14h20M4 14V9a4 4 0 014-4h8a4 4 0 014 4v5M4 18v2M20 18v2" />
      </svg>
    ),
  },
];

const highlights = [
  {
    label: "Private parking",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x={2} y={8} width={20} height={9} rx={2} />
        <path d="M6 17v2M18 17v2" />
      </svg>
    ),
  },
  {
    label: "Air conditioning",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 8h18M3 13h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "Free Wi-Fi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M5 12a10 10 0 0114 0M8 15a6 6 0 018 0M12 18h.01" />
      </svg>
    ),
  },
  {
    label: "Daily housekeeping",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 12l4 4 14-14M3 18l4 4 14-14" />
      </svg>
    ),
  },
  {
    label: "Meditation pavilion",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx={12} cy={8} r={3} />
        <path d="M5 21c0-4 3-7 7-7s7 3 7 7" />
      </svg>
    ),
  },
  {
    label: "Outdoor furniture",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M4 20V9l8-5 8 5v11M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    label: "Balcony / terrace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 21h18M5 21V10h14v11M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    label: "Ocean view",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 20c4-4 8-4 12 0M3 15c4-4 8-4 12 0" />
      </svg>
    ),
  },
  {
    label: "Mangrove view",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 21c4-4 8-4 12 0M3 16c4-4 8-4 12 0M3 11c4-4 8-4 12 0" />
      </svg>
    ),
  },
  {
    label: "Restaurant & bar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 3v8M10 3v8M14 3v8M18 3v8M4 11h16l-1 10H5L4 11z" />
      </svg>
    ),
  },
  {
    label: "Sunbeds",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 17h18M5 17V11a2 2 0 012-2h10a2 2 0 012 2v6M8 9V6a4 4 0 018 0v3" />
      </svg>
    ),
  },
  {
    label: "Infinity pool",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 20c4-4 8-4 12 0M3 16c4-4 8-4 12 0" />
      </svg>
    ),
  },
];

const galleryCells = [
  { className: styles.phBg1, label: "[ Hero shot · living room / ocean view ]", main: true },
  { className: styles.phBg2, label: "[ Lounge ]", main: false },
  { className: styles.phBg3, label: "[ Bedroom ]", main: false },
  { className: styles.phBg4, label: "[ Pool / garden ]", main: false },
  { className: styles.phBg5, label: "[ Bath ]", main: false, showAllButton: true },
];

export default function MangroveHousePage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8">
      <header className="flex flex-col gap-6 pt-8 pb-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <div className="text-ink-soft mb-3.5 flex items-center gap-2 text-[13px]">
            <span aria-label="5 stars" className="text-accent flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
                  <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.1L12 17.7 5.7 21.3l1.7-7.1L2 9.5l7.1-.6L12 2z" />
                </svg>
              ))}
            </span>
            Boutique retreat · Bali, Indonesia
          </div>
          <h1 className="font-serif text-[44px] leading-none tracking-[-0.015em] sm:text-[56px] md:text-[64px]">
            The Mangrove House
          </h1>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="text-muted-foreground text-xs tracking-[0.08em] uppercase">
            Starting from
          </div>
          <div className="font-serif mt-1 text-3xl">
            IDR 4,249K{" "}
            <span className="text-muted-foreground ml-1.5 font-sans text-sm">/ night</span>
          </div>
        </div>
      </header>

      <section className={styles.gallery} aria-label="Photo gallery">
        {galleryCells.map((cell, idx) => (
          <div
            key={idx}
            className={`${styles.cell} ${cell.main ? styles.cellMain : ""} ${cell.className}`}
          >
            <div className={styles.phPattern} />
            <div className={`${styles.ph} ${cell.main ? styles.phMain : ""}`}>{cell.label}</div>
            {cell.showAllButton && (
              <button
                type="button"
                className="text-foreground absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
              >
                See all 12 photos
                <Maximize2 className="size-3" />
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="mt-20 grid gap-16 pb-30 md:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-serif mb-9 max-w-[520px] text-[36px] leading-[1.05] tracking-[-0.01em] sm:text-[42px] md:text-5xl">
            Designed for <em className="text-accent italic">slow mornings</em> &{" "}
            <em className="text-accent italic">longer stays</em>
          </h2>

          <div className="mb-8 grid max-w-[560px] grid-cols-1 gap-2.5 sm:grid-cols-2">
            {specs.map(({ label, icon }) => (
              <div
                key={label}
                className="bg-card text-ink-soft flex items-center gap-2.5 rounded-xl px-[18px] py-3.5 text-sm"
              >
                <span className="text-accent size-4 shrink-0">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          <p className="text-ink-soft mb-12 max-w-[540px] text-base leading-[1.65]">
            A small boutique retreat tucked between mangrove forest and the Indian Ocean. Each suite
            is built around a quiet idea of comfort. Natural materials, generous light, and nothing
            in the way of the view.
          </p>

          <details className={`${styles.expand} border-border max-w-[560px] border-t py-6`} open>
            <summary>The space</summary>
            <p className="text-ink-soft mt-3.5 text-[14.5px] leading-[1.65]">
              Open-plan living with a private terrace, full kitchenette, and floor-to-ceiling
              sliding doors that pull the garden inside. Hand-finished timber, linen, and stone
              throughout.
            </p>
          </details>
          <details className={`${styles.expand} border-border max-w-[560px] border-t py-6`}>
            <summary>What&apos;s included</summary>
            <p className="text-ink-soft mt-3.5 text-[14.5px] leading-[1.65]">
              Slow breakfast served on the terrace, daily housekeeping, organic toiletries,
              complimentary bicycles, and a curated welcome basket from nearby growers.
            </p>
          </details>
          <details className={`${styles.expand} border-border max-w-[560px] border-t py-6`}>
            <summary>Getting here</summary>
            <p className="text-ink-soft mt-3.5 text-[14.5px] leading-[1.65]">
              A 45-minute drive from Ngurah Rai International Airport. Private transfers can be
              arranged at the time of booking.
            </p>
          </details>
          <details className={`${styles.expand} border-border max-w-[560px] border-t py-6`}>
            <summary>House policy</summary>
            <p className="text-ink-soft mt-3.5 text-[14.5px] leading-[1.65]">
              Check-in from 2pm, check-out by 11am. No smoking. Minimum stay of two nights.
              Cancellations free up to 14 days before arrival.
            </p>
          </details>
        </div>

        <aside className="bg-card self-start rounded-[var(--radius)] p-8 md:sticky md:top-32">
          <h3 className="font-serif mb-5.5 text-[22px]">Property highlights</h3>
          <ul className="flex flex-col gap-3.5">
            {highlights.map(({ label, icon }) => (
              <li key={label} className="text-ink-soft flex items-center gap-3 text-sm">
                <span className="text-accent size-4 shrink-0">{icon}</span>
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/inquiry"
            className="bg-accent-deep text-background hover:bg-accent mt-7 flex w-full items-center justify-center gap-2.5 rounded-full px-5.5 py-4.5 text-[15px] font-medium transition-colors"
          >
            Reserve your stay
            <ArrowUpRight className="size-3.5" />
          </Link>
        </aside>
      </section>
    </div>
  );
}
