"use client";

import dynamic from "next/dynamic";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/**
 * Wrapper around Mux Player for cinematic looped hero backgrounds.
 * Falls back to a poster-color block if no playback ID is supplied yet.
 *
 * Once you have a Mux account, upload a video and pass its playback ID:
 *   <HeroVideo playbackId="abc123xyz" />
 */
export function HeroVideo({
  playbackId,
  poster,
  className,
}: {
  playbackId?: string;
  poster?: string;
  className?: string;
}) {
  if (!playbackId) {
    return (
      <div
        className={`bg-card relative overflow-hidden ${className ?? ""}`}
        style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: "cover" } : undefined}
        aria-hidden
      />
    );
  }

  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      autoPlay
      muted
      loop
      playsInline
      style={{
        ["--media-object-fit" as never]: "cover",
        ["--controls" as never]: "none",
      }}
      className={className}
    />
  );
}
