"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/**
 * Cross-page fade. Reason: a 200ms opacity settle on each navigation tells the
 * reader they've arrived somewhere new, without the app-like feel of a slide.
 *
 * Opacity only — never transform. Keyed by pathname so it replays on every route
 * change. The App Router swaps server-rendered content synchronously, so an
 * *enter* fade is the reliable shape here (AnimatePresence exit animations can
 * double-render the incoming page). Honors prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      className="flex flex-1 flex-col"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
