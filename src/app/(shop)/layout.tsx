import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import MobileMenu from "@/components/layout/MobileMenu";
import SearchOverlay from "@/components/layout/SearchOverlay";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <WhatsAppWidget />
      <Footer />
    </>
  );
}
