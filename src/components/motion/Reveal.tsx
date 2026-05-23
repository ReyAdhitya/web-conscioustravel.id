"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

/**
 * Gentle fade-up reveal when the element first scrolls into view.
 * Honors prefers-reduced-motion (renders inert).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
