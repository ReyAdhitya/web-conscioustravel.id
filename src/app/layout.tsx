import type { Metadata } from "next";
import { Manrope, Fraunces, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { IntroOverlay } from "@/components/loaders/IntroOverlay";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Conscious Travel · Sustainable & Mindful Journeys across Asia",
    template: "%s · Conscious Travel",
  },
  description:
    "Eco-conscious tours, wellness retreats, and slow-travel experiences across Indonesia, Vietnam, Thailand and Japan. Curated low-impact journeys with local communities and sustainable operators.",
  // Drives absolute URLs for OG images and canonicals. Same env-driven source as
  // sitemap.ts / robots.ts so every environment resolves consistently.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://conscioustravel.id",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <IntroOverlay />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
