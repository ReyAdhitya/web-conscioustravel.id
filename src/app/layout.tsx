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
    default: "Conscious Travel · Sustainable & Mindful Journeys in Indonesia",
    template: "%s · Conscious Travel",
  },
  description:
    "Eco-conscious tours, wellness retreats, and slow-travel experiences across Indonesia. Curated low-impact journeys with local communities and certified sustainable operators.",
  metadataBase: new URL("https://conscioustravel.id"),
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
