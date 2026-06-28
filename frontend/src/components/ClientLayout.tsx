"use client";

import { usePathname } from "next/navigation";
import { AppProvider } from "../context/AppContext";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import ToastContainer from "./ToastContainer";
import AgeVerificationModal from "./AgeVerificationModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <AppProvider>
      {!isAdminRoute && <Header />}
      {!isAdminRoute && <MobileMenu />}
      <main className={isAdminRoute ? "" : "min-h-screen"}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      <CartDrawer />
      <ToastContainer />
      {!isAdminRoute && <AgeVerificationModal />}
    </AppProvider>
  );
}
