"use client";

import { AppProvider } from "../context/AppContext";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import ToastContainer from "./ToastContainer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Header />
      <MobileMenu />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </AppProvider>
  );
}
