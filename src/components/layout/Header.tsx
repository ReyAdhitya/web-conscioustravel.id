"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/tours", label: "Journeys" },
  { href: "/stays", label: "Stays" },
  { href: "/inquiry", label: "Custom" },
  { href: "/sustainability", label: "Journal" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // A nav item is active on its own route and any nested route beneath it.
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 rounded-none border-b backdrop-blur-md transition-all duration-300 md:inset-x-auto md:top-6 md:left-1/2 md:max-w-[95vw] md:-translate-x-1/2 md:rounded-full md:border ${
          scrolled
            ? "border-border/50 bg-background/90 shadow-[0_10px_30px_rgba(31,42,36,0.12)]"
            : "border-border/30 bg-background/65 shadow-[0_4px_18px_rgba(31,42,36,0.06)]"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-5 py-2.5 md:max-w-none md:gap-6 md:pr-2 md:pl-5">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center"
            onClick={() => setOpen(false)}
            aria-label="conscioustravel.id home"
          >
            <Image
              src="/logo.png"
              alt="conscioustravel.id"
              width={1560}
              height={330}
              priority
              className="h-8 w-auto shrink-0 md:h-7 lg:h-9"
            />
          </Link>

          <nav className="text-ink-soft hidden items-center gap-5 text-[13px] md:flex lg:gap-7">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap transition-colors ${
                    active ? "text-accent" : "hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/inquiry"
            className="bg-accent-deep text-background hover:bg-accent hidden h-11 shrink-0 items-center rounded-full px-5 text-[13px] font-medium whitespace-nowrap transition-colors md:inline-flex"
          >
            Book
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground hover:text-accent flex h-11 w-11 items-center justify-center rounded-full transition-colors md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="bg-background/95 fixed inset-0 top-16 z-30 overflow-y-auto backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-md flex-col px-6 pt-6 pb-12">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`border-border/40 border-b py-5 text-xl transition-colors last:border-b-0 ${
                    active ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/inquiry"
              onClick={() => setOpen(false)}
              className="bg-accent-deep text-background hover:bg-accent mt-8 inline-flex justify-center rounded-full px-6 py-4 text-base font-medium transition-colors"
            >
              Book
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
