import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Lost the trail",
  description:
    "The page you were looking for has wandered off the map. Let us help you find a journey instead.",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-background flex flex-1 items-center px-6 pt-32 pb-24 sm:px-8 sm:pt-40 sm:pb-32">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
            Lost the trail · 404
          </p>
          <h1 className="text-foreground font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            We can&apos;t find that page.{" "}
            <span className="text-accent italic">But we can find you a journey.</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
            The link you followed may have moved, or the trail simply ended here. Wander back to our
            curated journeys, or tell us where you&apos;d like to go next.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/tours">Browse journeys</Link>}
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
            <Button
              render={<Link href="/inquiry">Plan a custom trip</Link>}
              variant="ghost"
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
