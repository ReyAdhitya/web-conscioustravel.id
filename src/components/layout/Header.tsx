"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/tours", label: "Tours" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/inquiry", label: "Custom journey" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="text-foreground">Conscious</span>
          <span className="text-accent">.</span>
          <span className="text-muted-foreground">travel</span>
        </Link>

        <nav className="text-muted-foreground hidden items-center gap-8 text-sm sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-foreground hover:text-accent flex h-10 w-10 items-center justify-center rounded-full transition sm:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-border/60 bg-background border-t sm:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground hover:text-accent border-border/40 border-b py-4 text-base tracking-tight transition last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
