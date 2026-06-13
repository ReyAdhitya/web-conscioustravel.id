import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { PageTransition } from "@/components/motion/PageTransition";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <MagneticCursor />
      <Header />
      <main id="main-content" className="flex flex-1 flex-col pt-16 md:pt-24">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
