"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

function isValidSrc(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  // Local public/ assets are referenced by root-relative path (e.g. "/images/tours/x.jpg").
  // next/image serves these directly without a remotePatterns entry.
  if (value.startsWith("/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * `next/image` with a graceful fallback. Renders `fallback` when the src is missing
 * or syntactically invalid, AND when a valid src fails to load at runtime (a dead
 * remote image that 404s, or a local file that isn't there). Without this, a
 * valid-but-broken src renders an empty broken <img>; here it degrades to the same
 * placeholder used for missing images.
 *
 * Accepts both full remote URLs (https://…, must be allowlisted in next.config) and
 * root-relative local paths under public/ (e.g. "/images/tours/komodo.jpg").
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

  if (!isValidSrc(src) || erroredSrc === src) return <>{fallback}</>;

  return <Image src={src} alt={alt} onError={() => setErroredSrc(src)} {...props} />;
}
