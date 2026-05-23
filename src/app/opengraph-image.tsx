import { ImageResponse } from "next/og";

export const alt = "Conscious Travel — Sustainable & Mindful Journeys in Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #faf7f1 0%, #ece3d2 50%, #c5d4b5 100%)",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#2d5240",
            }}
          />
          <span style={{ fontSize: "26px", color: "#1f2a24", letterSpacing: "-0.01em" }}>
            conscious<span style={{ fontStyle: "italic" }}>travel</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p
            style={{
              fontSize: "16px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#3a4640",
              margin: 0,
              fontFamily: "sans-serif",
            }}
          >
            Sustainable &amp; wellness travel · Indonesia
          </p>
          <h1
            style={{
              fontSize: "92px",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "#0f2419",
              margin: 0,
              maxWidth: "1000px",
            }}
          >
            Travel softly.
            <br />
            <span style={{ fontStyle: "italic", color: "#1a3a2a" }}>Indonesia, slowly.</span>
          </h1>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span
            style={{
              fontSize: "18px",
              color: "#3a4640",
              fontFamily: "sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Curated low-impact journeys across the archipelago.
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#8a8478",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            conscioustravel.id
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
