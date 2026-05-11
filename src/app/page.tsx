import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="hero-bg relative flex min-h-[88vh] flex-col justify-between overflow-hidden px-6 pt-8 pb-16 sm:px-12 lg:px-20">
        <header className="flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-tight">
            <span className="text-foreground">Conscious</span>
            <span className="text-accent">.</span>
            <span className="text-muted-foreground">travel</span>
          </Link>
          <nav className="text-muted-foreground hidden items-center gap-8 text-sm sm:flex">
            <Link href="/tours" className="hover:text-foreground">
              Tours
            </Link>
            <Link href="/sustainability" className="hover:text-foreground">
              Sustainability
            </Link>
            <Link href="/inquiry" className="hover:text-foreground">
              Custom journey
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">EN</span>
            <span className="text-border">·</span>
            <span className="text-muted-foreground">IDR</span>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-20 sm:py-28">
          <p className="text-muted-foreground mb-6 text-xs tracking-[0.25em] uppercase">
            Sustainable & wellness travel · Indonesia
          </p>
          <h1 className="text-foreground font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Travel softly.
            <br />
            <span className="text-accent italic">Indonesia, slowly.</span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
            Curated low-impact journeys across the archipelago — wellness retreats, community-led
            stays, and quiet corners off the package-tour map.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/tours">Explore journeys</Link>}
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
            <Button
              render={<Link href="/inquiry">Plan a custom trip</Link>}
              variant="ghost"
              className="h-12 rounded-full px-7 text-sm tracking-wide"
            />
          </div>
        </div>

        <footer className="text-muted-foreground flex items-end justify-between text-xs">
          <span>Bali · Java · Sumba · Flores · Raja Ampat</span>
          <span className="hidden sm:inline">Scroll to explore ↓</span>
        </footer>
      </section>
    </main>
  );
}
