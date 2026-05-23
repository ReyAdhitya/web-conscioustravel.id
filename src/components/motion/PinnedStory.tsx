"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const panels = [
  {
    tag: "01",
    title: "Small groups.",
    body: "Maximum of twelve travelers per departure. The math behind low-impact travel starts with how many people are in the boat.",
  },
  {
    tag: "02",
    title: "Local hosts.",
    body: "Every operator is someone we've personally stayed with. No automated sourcing, no aggregator middlemen. People you'd have over for dinner.",
  },
  {
    tag: "03",
    title: "Slower itineraries.",
    body: "An extra night somewhere quiet beats one more checklist destination. We design routes that prefer presence over coverage.",
  },
];

export function PinnedStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const items = gsap.utils.toArray<HTMLElement>(".pinned-panel");
      const total = items.length;

      gsap.set(items, { opacity: 0, y: 40 });
      gsap.set(items[0], { opacity: 1, y: 0 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${(total - 1) * window.innerHeight * 0.85}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress * (total - 1);
          items.forEach((el, i) => {
            const dist = Math.abs(progress - i);
            const t = Math.max(0, 1 - dist);
            gsap.set(el, {
              opacity: t,
              y: (i - progress) * 60,
            });
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-screen overflow-hidden">
      <div className="hero-bg absolute inset-0 -z-10" />
      <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-center px-6 sm:px-8">
        <p className="text-muted-foreground mb-12 text-[11px] tracking-[0.25em] uppercase">
          The shape of the journey
        </p>
        <div className="relative h-[60vh] max-h-[520px]">
          {panels.map((p, i) => (
            <article
              key={p.tag}
              className="pinned-panel absolute inset-0 flex max-w-3xl flex-col justify-center"
              data-index={i}
            >
              <span className="font-mono text-accent mb-6 text-xs tracking-[0.25em]">{p.tag}</span>
              <h2 className="font-serif text-foreground text-[44px] leading-[1.02] tracking-[-0.015em] sm:text-[56px] md:text-[72px]">
                {p.title}
              </h2>
              <p className="text-ink-soft mt-7 max-w-xl text-base leading-[1.65] sm:text-lg">
                {p.body}
              </p>
            </article>
          ))}
        </div>
        <div className="text-muted-foreground mt-auto flex justify-between pt-12 text-xs tracking-[0.2em] uppercase">
          <span>Scroll</span>
          <span>01 / 03</span>
        </div>
      </div>
    </section>
  );
}
