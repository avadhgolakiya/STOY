"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function Header() {
  const router = useRouter();
  const { toggleCart, toggleMobileMenu, showToast, cart, setSearchQuery, isLoggedIn, wishlist } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-velvet-400 shadow-lg" : "bg-velvet-400/95 backdrop-blur-md border-b border-luxePink-500/15"}`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 h-[90px] flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex flex-col justify-center cursor-pointer group" onClick={handleLogoClick}>
            <span className="font-[cursive] text-4xl text-luxePink-500 italic pr-1 transition duration-500 group-hover:text-white drop-shadow-md">
              Adult store
            </span>
            <span style={{ fontSize: '5px !important' }} className="text-luxePink-500 text-xs sm:text-sm tracking-[0.15em] mt-1 font-sans uppercase text-glow-pink">
              Exclusive Velvet & Pink Atelier
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-white font-medium text-[13px] uppercase tracking-widest">
            <a href="/#hero" className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">Home</a>
            {/* <a href="/#collections" className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">The Edit</a> */}
            <a href="/#brand-showcase" className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">Luxury Maisons</a>
            <a href="/#new-arrivals" className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">New Arrivals</a>
          </nav>

          {/* Right Section: Search, Icons, and CTA Button */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="relative group mr-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (window.location.pathname !== '/') {
                    router.push('/#product-grid');
                  } else {
                    const grid = document.getElementById('product-grid');
                    if (grid && e.target.value) {
                      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }}
                placeholder="Search..."
                className="w-32 xl:w-40 bg-velvet-300/60 border border-luxePink-500/20 rounded-full py-1.5 pl-8 pr-3 text-[11px] text-white placeholder-gray-400 focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2 text-luxePink-500/60 text-[10px]"></i>
            </div>

            <button
              onClick={() => {
                if (isLoggedIn) {
                  router.push('/profile');
                } else {
                  router.push('/auth');
                }
              }}
              className="text-white hover:text-luxePink-500 cursor-pointer luxury-transition hover:text-glow-pink"
            >
              <i className="fa-regular fa-user text-lg"></i>
            </button>

            {isLoggedIn && (
              <div onClick={() => router.push('/profile')} className="relative cursor-pointer text-white hover:text-luxePink-500 luxury-transition hover:text-glow-pink">
                <i className="fa-regular fa-heart text-lg"></i>
                <span className="absolute -top-1.5 -right-2 bg-luxePink-500 text-velvet-400 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg">{wishlist.length}</span>
              </div>
            )}

            <div onClick={toggleCart} className="relative cursor-pointer text-luxePink-500 hover:text-white luxury-transition hover:text-glow-pink mr-2">
              <i className="fa-solid fa-bag-shopping text-xl"></i>
              <span className="absolute -top-1 -right-2 bg-white text-velvet-400 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-bounce">{cartItemCount}</span>
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-5">
            <div onClick={toggleCart} className="relative cursor-pointer text-luxePink-500">
              <i className="fa-solid fa-bag-shopping text-xl"></i>
              <span className="absolute -top-1 -right-2 bg-white text-velvet-400 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">{cartItemCount}</span>
            </div>
            <button onClick={toggleMobileMenu} className="text-white hover:text-luxePink-500 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
