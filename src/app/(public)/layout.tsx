import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MagneticCursor } from "@/components/motion/MagneticCursor";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <MagneticCursor />
      <Header />
      <main className="flex flex-1 flex-col pt-16 md:pt-24">{children}</main>
      <Footer />
    </>
  );
}
