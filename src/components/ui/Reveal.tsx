"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { createElement, type ReactNode } from "react";

/**
 * Scroll-reveal system — one entrance vocabulary for the whole site.
 *
 * Reason (DESIGN.md › Motion): content should arrive with intention, not snap
 * into place. We animate ONLY opacity (0 → 1) and translateY (24px → 0) over
 * 500ms on an expo-out curve, staggering 60ms between siblings. No scale,
 * rotate, or blur — those read as decoration, not arrival.
 *
 * Honors prefers-reduced-motion by rendering the element inert (no transform,
 * no transition) so the page is fully usable with motion muted.
 *
 *   <Reveal>…</Reveal>                  one block, fades up as a unit
 *   <Reveal index={i}>…</Reveal>        grid item, delay derived from position
 *   <RevealGroup><RevealItem/>…</…>     a list that staggers its own children
 */

// Spec-locked tokens. Import these anywhere an entrance must match the system.
export const REVEAL_EASE = [0.19, 1, 0.22, 1] as const; // expo-out
export const REVEAL_DURATION = 0.5; // 500ms — within the 400–600ms reveal band
export const REVEAL_STAGGER = 0.06; // 60ms between siblings
const REVEAL_Y = 24; // px
const STAGGER_CAP = 5; // late grid items shouldn't lag behind the viewport

type Tag = "div" | "section" | "article" | "ul" | "ol" | "li" | "span";

// --- Single element ---------------------------------------------------------

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  index,
  y = REVEAL_Y,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  /** Explicit entrance delay, in seconds. */
  delay?: number;
  /** Grid position → staggered delay (capped so off-screen items don't lag). */
  index?: number;
  y?: number;
  /** Fraction of the element visible before it triggers. */
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);

  const Tag = motion[as];
  const resolvedDelay =
    delay + (index != null ? Math.min(index, STAGGER_CAP) * REVEAL_STAGGER : 0);

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE, delay: resolvedDelay }}
    >
      {children}
    </Tag>
  );
}

// --- Staggered group --------------------------------------------------------
// Use when a set of siblings should arrive together, one after another, as the
// group scrolls into view (e.g. itinerary days). For long grids prefer the
// per-item <Reveal index> above so each card reveals as it personally enters.

const groupVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE },
  },
};

export function RevealGroup({
  children,
  className,
  as = "div",
  delay = 0,
  stagger = REVEAL_STAGGER,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  stagger?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);

  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={groupVariants(stagger, delay)}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  if (reduce) return createElement(as, { className }, children);

  const Tag = motion[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
