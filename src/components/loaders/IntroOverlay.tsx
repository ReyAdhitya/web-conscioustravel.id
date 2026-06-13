"use client";

import { useEffect, useState } from "react";
import { TreeLoader } from "./TreeLoader";

const SESSION_KEY = "ct-intro-shown";

export function IntroOverlay() {
  // Start as null so SSR renders nothing and we don't briefly flash the overlay
  // for returning visitors. The first client effect promotes us into the
  // correct state.
  const [phase, setPhase] = useState<"hidden" | "visible" | "leaving">("hidden");

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyShown) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    // First-visit gate: sessionStorage is client-only, so the overlay is promoted
    // from its SSR-safe "hidden" state here, on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("visible");

    // Lock scroll while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("leaving"), 2400);
    const removeTimer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = prevOverflow;
    }, 3000); // 2400ms held + 600ms exit

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    // Exit reads as a curtain rising — fade + lift away over 600ms on an
    // expo-out curve — so it sets the editorial tone, never feels like a spinner.
    <div
      aria-hidden={phase === "leaving"}
      className={`bg-background fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 transition duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
        phase === "leaving"
          ? "pointer-events-none -translate-y-8 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <TreeLoader label="Welcome to conscioustravel.id" />
      <p className="font-serif text-foreground text-2xl tracking-[-0.01em] sm:text-3xl">
        conscious<span className="text-accent italic">travel</span>
        <span className="text-muted-foreground">.id</span>
      </p>
    </div>
  );
}
