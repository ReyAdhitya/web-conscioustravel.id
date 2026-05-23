import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-border/60 border-b px-6 py-20 sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-muted-foreground mb-4 text-[11px] tracking-[0.25em] uppercase">
            {eyebrow}
          </p>
          <h1 className="font-serif text-[40px] leading-[1.05] tracking-[-0.015em] sm:text-[52px]">
            {title}
          </h1>
          <p className="text-muted-foreground mt-6 text-sm">Last updated: {updated}</p>
        </div>
      </section>
      <section className="px-6 py-16 sm:px-8">
        <div className="prose-content mx-auto w-full max-w-3xl text-[15px] leading-[1.75] text-foreground [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:tracking-tight [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:list-inside [&>ul]:list-disc [&>ul]:space-y-1.5 [&>a]:text-accent [&>a]:underline [&>a]:underline-offset-4">
          {children}
        </div>
      </section>
    </>
  );
}
