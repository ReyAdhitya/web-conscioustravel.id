"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={
        isActive
          ? "text-foreground text-sm font-medium"
          : "text-muted-foreground hover:text-foreground text-sm transition"
      }
    >
      {children}
    </Link>
  );
}
