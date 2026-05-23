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
    setPhase("visible");

    // Lock scroll while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("leaving"), 2400);
    const removeTimer = window.setTimeout(() => {
      setPhase("hidden");
      document.body.style.overflow = prevOverflow;
    }, 3200);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden={phase === "leaving"}
      className={`bg-background fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 transition-opacity duration-700 ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
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
