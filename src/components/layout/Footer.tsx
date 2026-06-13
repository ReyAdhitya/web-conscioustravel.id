import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

const generalLinks = [
  { href: "/inquiry", label: "Get in touch ↗" },
];

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Journeys" },
  { href: "/inquiry", label: "Custom journey" },
  { href: "/sustainability", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/inquiry", label: "Contact" },
];

const importantLinks = [
  { href: "/booking-terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/press", label: "Press & Media" },
  { href: "/sustainability", label: "Impact Report 2026" },
  { href: "/booking-terms", label: "Safety & Guidelines" },
];

const socialLinks = [
  { href: "https://www.instagram.com/conscioustravel.id/", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-border/60 bg-background border-t pt-18 pb-10">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
        <div className="mb-18 grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <h2 className="font-serif text-[clamp(56px,8vw,120px)] leading-[0.85] tracking-[-0.04em]">
            <span className="text-foreground block">conscious</span>
            <span className="block">
              <span className="text-accent italic">travel</span>
              <span className="text-foreground">.</span>
            </span>
          </h2>
          <div className="min-w-0">
            <NewsletterForm />
          </div>
        </div>

        <div className="border-border/60 grid gap-12 border-t pt-12 md:grid-cols-[1.2fr_1fr_1fr] md:gap-12">
          <div>
            <h4 className="text-muted-foreground mb-[18px] text-xs font-medium">
              General inquiries & partnerships
            </h4>
            <div className="flex flex-col gap-2.5">
              {generalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-accent text-[15px] underline underline-offset-4 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <address className="text-ink-soft mt-6 text-sm leading-[1.7] not-italic">
              Jalan Pantai, Mangrove Bay
              <br />
              Bali, 80361
              <br />
              Indonesia
            </address>
            <div className="text-ink-soft mt-7 flex flex-wrap gap-x-[18px] gap-y-2 text-sm">
              {socialLinks.map((social) => {
                const isExternal = social.href.startsWith("http");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="hover:text-accent transition"
                    {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-[18px] text-xs font-medium">Menu</h4>
            <div className="flex flex-col gap-2.5">
              {menuLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-foreground hover:text-accent text-[15px] transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-[18px] text-xs font-medium">
              Important Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {importantLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-foreground hover:text-accent text-[15px] transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border/60 text-muted-foreground mt-14 flex flex-col gap-2 border-t pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} conscioustravel. All rights reserved.</span>
          <span>Made with care · Bali, Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
