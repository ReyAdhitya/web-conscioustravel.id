import Link from "next/link";

const navItems = [
  { href: "/tours", label: "Tours" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/inquiry", label: "Custom journey" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12 lg:px-20">
        <Link href="/" className="font-serif text-lg tracking-tight">
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
        <div className="flex items-center gap-2 text-sm">
          <button className="text-muted-foreground hover:text-foreground transition" type="button">
            EN
          </button>
          <span className="text-border">·</span>
          <button className="text-muted-foreground hover:text-foreground transition" type="button">
            IDR
          </button>
        </div>
      </div>
    </header>
  );
}
