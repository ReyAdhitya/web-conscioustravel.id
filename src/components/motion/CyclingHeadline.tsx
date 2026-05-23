"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// Each row is one full headline state: [first line, second-line italic].
const PHRASES: ReadonlyArray<readonly [string, string]> = [
  ["Travel softly.", "Indonesia, slowly."],
  ["Travel slowly.", "Indonesia, gently."],
  ["Travel mindfully.", "Indonesia, quietly."],
  ["Travel deeply.", "Indonesia, soulfully."],
  ["Travel kindly.", "Indonesia, openly."],
];

const ease = [0.65, 0, 0.35, 1] as const;

export function CyclingHeadline({
  className,
  italicClassName,
  intervalMs = 4200,
}: {
  className?: string;
  italicClassName?: string;
  intervalMs?: number;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % PHRASES.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, reduce]);

  const [first, second] = PHRASES[i];

  if (reduce) {
    return (
      <h1 className={className}>
        <span className="block">{first}</span>
        <span className={`block italic ${italicClassName ?? ""}`}>{second}</span>
      </h1>
    );
  }

  return (
    <h1 className={className}>
      <span className="block overflow-hidden pb-[0.08em]">
        <AnimatePresence mode="wait" initial={true}>
          <motion.span
            key={`a-${i}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-110%" }}
            transition={{ duration: 0.75, ease: [...ease] }}
            className="inline-block"
          >
            {first}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className={`block overflow-hidden pb-[0.08em] italic ${italicClassName ?? ""}`}>
        <AnimatePresence mode="wait" initial={true}>
          <motion.span
            key={`b-${i}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-110%" }}
            transition={{ duration: 0.75, ease: [...ease], delay: 0.12 }}
            className="inline-block"
          >
            {second}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
