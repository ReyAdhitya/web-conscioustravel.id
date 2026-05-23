"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useSpring, motion } from "motion/react";

const HOVER_SELECTOR = "a, button, [data-cursor-hover]";

export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 240, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 240, damping: 26, mass: 0.5 });
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, { stiffness: 280, damping: 24 });
  const opacity = useMotionValue(0);
  const opacitySpring = useSpring(opacity, { stiffness: 300, damping: 28 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      opacity.set(1);
    };

    const out = (e: PointerEvent) => {
      // Mouse left the viewport
      if (e.relatedTarget === null) opacity.set(0);
    };

    // Delegate hover scaling: pointerover/pointerout bubble, so dynamically
    // mounted links still trigger.
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) {
        animate(scale, 2.6, { duration: 0.22, ease: "easeOut" });
      }
    };

    const offHover = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) {
        animate(scale, 1, { duration: 0.22, ease: "easeOut" });
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", out);
    window.addEventListener("pointerover", over, true);
    window.addEventListener("pointerout", offHover, true);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("pointerover", over, true);
      window.removeEventListener("pointerout", offHover, true);
    };
  }, [x, y, scale, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy, opacity: opacitySpring }}
      className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        style={{ scale: scaleSpring }}
        className="size-2 rounded-full bg-foreground mix-blend-difference"
      />
    </motion.div>
  );
}
