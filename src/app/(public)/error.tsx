"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for the public segment. Next renders this in place of the page
 * (inside the public layout, so Header/Footer/grain remain) whenever a page or
 * its data throws. Keeps the brand voice instead of the raw white error screen.
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console / server logs. `digest` ties this render to the
    // server-side stack trace in production.
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex flex-1 items-center px-6 pt-20 pb-24 sm:px-8 sm:pt-28">
      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
          Something went wrong
        </p>
        <h1 className="text-foreground font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          A bend in the trail.{" "}
          <span className="text-accent italic">Let&apos;s get you back.</span>
        </h1>
        <p className="text-ink-soft mx-auto mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
          An unexpected error interrupted this page. You can try again, or head back to our
          journeys while we look into it.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} className="h-12 rounded-full px-7 text-sm tracking-wide">
            Try again
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/">Back to home</Link>}
            variant="ghost"
            className="h-12 rounded-full px-7 text-sm tracking-wide"
          />
        </div>
        {error.digest && (
          <p className="text-muted-foreground/70 mt-10 font-mono text-[11px] tracking-[0.05em]">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
