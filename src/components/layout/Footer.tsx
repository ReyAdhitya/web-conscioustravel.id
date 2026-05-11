import Link from "next/link";

const footerSections = [
  {
    title: "Travel",
    links: [
      { href: "/tours", label: "All journeys" },
      { href: "/tours?category=wellness", label: "Wellness retreats" },
      { href: "/tours?category=eco", label: "Eco expeditions" },
      { href: "/inquiry", label: "Custom itinerary" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/sustainability", label: "Sustainability" },
      { href: "/operators", label: "Local partners" },
      { href: "/press", label: "Press" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/booking-terms", label: "Booking terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border/60 bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12 lg:px-20">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-serif text-xl tracking-tight">
              <span className="text-foreground">Conscious</span>
              <span className="text-accent">.</span>
              <span className="text-muted-foreground">travel</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
              Sustainable, mindful journeys across Indonesia. Curated with local communities and
              certified low-impact operators.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-foreground mb-4 text-xs tracking-[0.2em] uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-border/60 text-muted-foreground mt-12 flex flex-col gap-4 border-t pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Conscious Travel · PT Conscious Travel Indonesia</span>
          <span>Bali · Java · Sumba · Flores · Raja Ampat</span>
        </div>
      </div>
    </footer>
  );
}
