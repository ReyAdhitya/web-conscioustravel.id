"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself, where a
 * segment-level error.tsx can't reach. It replaces the whole document, so neither
 * globals.css nor the brand fonts are guaranteed — every style here is inline,
 * using the brand cream/forest values directly. Kept deliberately tiny.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf7f1",
          color: "#1f2a24",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#6b6456",
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "32px",
              lineHeight: 1.1,
              fontWeight: 500,
            }}
          >
            The page couldn&apos;t load.
          </h1>
          <p style={{ margin: "20px 0 0", fontSize: "16px", lineHeight: 1.6, color: "#3a4640" }}>
            An unexpected error interrupted the site. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "32px",
              height: "48px",
              padding: "0 28px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#162a22",
              color: "#faf7f1",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "32px", fontSize: "11px", color: "#8a8478", fontFamily: "monospace" }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
