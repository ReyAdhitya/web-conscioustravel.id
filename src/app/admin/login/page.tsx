import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-lg tracking-tight">
            <span className="text-foreground">Conscious</span>
            <span className="text-accent">.</span>
            <span className="text-muted-foreground">travel</span>
          </p>
          <p className="text-muted-foreground mt-2 text-xs tracking-[0.25em] uppercase">
            Admin · Internal
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
