import Link from "next/link";
import { logoutAction, requireAuth } from "@/lib/admin/auth";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/60 bg-background/90 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-base tracking-tight">
              <span className="text-foreground">Conscious</span>
              <span className="text-accent">.</span>
              <span className="text-muted-foreground">travel</span>
            </Link>
            <span className="text-muted-foreground text-[10px] tracking-[0.25em] uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition"
              target="_blank"
            >
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-muted-foreground hover:text-foreground text-sm transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
