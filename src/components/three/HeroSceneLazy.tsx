"use client";

import dynamic from "next/dynamic";

export const HeroSceneLazy = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 hero-bg" aria-hidden />,
  },
);
