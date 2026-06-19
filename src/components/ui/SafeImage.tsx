"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * `next/image` with a graceful fallback. Renders `fallback` when the src is missing
 * or syntactically invalid, AND when a valid URL fails to load at runtime (a dead
 * remote image that 404s). Without this, a valid-but-broken URL renders an empty
 * broken <img>; here it degrades to the same placeholder used for missing images.
 *
 * Client component (needs the `onError` handler). The `fallback` is rendered on the
 * server and passed through — keep it to plain markup, no event handlers.
 */
export function SafeImage({
  src,
  alt,
  fallback,
  ...props
}: Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  fallback: React.ReactNode;
}) {
  // Record which src failed, and derive `failed` by comparing. A changed src is
  // automatically re-attempted (no effect, no boolean reset, no cascading render).
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  if (!isValidUrl(src) || erroredSrc === src) return <>{fallback}</>;

  return <Image src={src} alt={alt} onError={() => setErroredSrc(src)} {...props} />;
}
