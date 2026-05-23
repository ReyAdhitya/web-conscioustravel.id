"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { createElement, type HTMLAttributes } from "react";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 110, damping: 16, mass: 0.8 },
  },
};

export function TextReveal({
  text,
  as = "span",
  delay = 0,
  stagger = 0.08,
  className,
  ...rest
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return createElement(as, { className, ...rest }, text);
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants(stagger, delay)}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pr-[0.25em] pb-[0.1em]"
        >
          <motion.span variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
