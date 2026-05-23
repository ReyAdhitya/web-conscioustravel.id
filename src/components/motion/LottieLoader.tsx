"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * Compact, generative Lottie spinner. Generated inline so the project doesn't
 * need an external .json file. Swap `animationData` with any Lottie export.
 */
export function LottieLoader({ size = 40 }: { size?: number }) {
  const animationData = useMemo(
    () => ({
      v: "5.7.0",
      fr: 30,
      ip: 0,
      op: 60,
      w: 200,
      h: 200,
      nm: "spinner",
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: "ring",
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          ao: 0,
          shapes: [
            {
              ty: "gr",
              it: [
                {
                  d: 1,
                  ty: "el",
                  s: { a: 0, k: [120, 120] },
                  p: { a: 0, k: [0, 0] },
                },
                {
                  ty: "st",
                  c: { a: 0, k: [0.176, 0.322, 0.251, 1] },
                  o: { a: 0, k: 100 },
                  w: { a: 0, k: 10 },
                  lc: 2,
                  lj: 1,
                  d: [
                    { n: "d", nm: "dash", v: { a: 0, k: 80 } },
                    { n: "g", nm: "gap", v: { a: 0, k: 280 } },
                    { n: "o", nm: "offset", v: { a: 0, k: 0 } },
                  ],
                },
                { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
              ],
              nm: "ring",
            },
          ],
          ip: 0,
          op: 60,
          st: 0,
        },
      ],
    }),
    [],
  );

  return (
    <div style={{ width: size, height: size }} aria-label="Loading">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
}
