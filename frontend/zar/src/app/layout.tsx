import type { Metadata } from "next";
import "@/styles/index.css";
import 'swiper/css';
import ReduxProvider from "@/store/ReduxProvider";
import Header from "@/components/ui/organisms/Header/Header";
import Footer from "@/components/ui/organisms/Footer/Footer";
import PageTransitionProvider from "@/components/ui/organisms/PageTransitionProvider/PageTransitionProvider";
import FirstVisitLoader from "@/components/ui/organisms/FirstVisitLoader/FirstVisitLoader";
import CartDrawer from "@/components/ui/organisms/CartDrawer/CartDrawer";

export const metadata: Metadata = {
  title: "Zar Jewels — India's Trusted Gold Bangle Manufacturer",
  description:
    "Crafting lightweight, elegant gold bangles through innovation, precision, and timeless craftsmanship. 60+ years of excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <CartDrawer />
          <FirstVisitLoader />
          <Header />
          <main style={{ paddingTop: '90px' }}>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}