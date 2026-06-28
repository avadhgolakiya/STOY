"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function Header() {
  const router = useRouter();
  const { toggleCart, toggleMobileMenu, showToast, cart, searchQuery, setSearchQuery, isLoggedIn, wishlist } = useAppContext();
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
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 h-[70px] sm:h-[90px] flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
            <img
              src="/logo.png"
              alt="adultDesire Logo"
              className="h-12 sm:h-20 w-auto object-contain transition duration-300 group-hover:scale-105 rounded-md"
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-white font-medium text-[12px] uppercase tracking-widest">
            <a href="/" className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">Home</a>
            
            {/* For Men Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-luxePink-400 luxury-transition hover:text-glow-pink uppercase tracking-widest text-[12px] font-medium focus:outline-none cursor-pointer">
                For Men <i className="fa-solid fa-chevron-down text-[8px] opacity-70 group-hover:rotate-180 transition-transform duration-300"></i>
              </button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-velvet-300 border border-luxePink-500/15 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <a href="/?category=masturbators#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Masturbators</a>
                <a href="/?category=cock-rings#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Cock Rings</a>
                <a href="/?category=penis-sleeves#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Penis Sleeves</a>
              </div>
            </div>

            {/* For Women Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-luxePink-400 luxury-transition hover:text-glow-pink uppercase tracking-widest text-[12px] font-medium focus:outline-none cursor-pointer">
                For Women <i className="fa-solid fa-chevron-down text-[8px] opacity-70 group-hover:rotate-180 transition-transform duration-300"></i>
              </button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-velvet-300 border border-luxePink-500/15 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <a href="/?category=vibrators#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Vibrators</a>
                <a href="/?category=dildo#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Dildos</a>
                <a href="/?category=butt-plug#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Butt Plugs</a>
              </div>
            </div>

            {/* For Couples Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-luxePink-400 luxury-transition hover:text-glow-pink uppercase tracking-widest text-[12px] font-medium focus:outline-none cursor-pointer">
                For Couples <i className="fa-solid fa-chevron-down text-[8px] opacity-70 group-hover:rotate-180 transition-transform duration-300"></i>
              </button>
              <div className="absolute top-full left-0 mt-1 w-44 bg-velvet-300 border border-luxePink-500/15 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <a href="/?category=BDSM#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">BDSM Kits</a>
                <a href="/?category=LUBRICANTS#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Lubricants</a>
                <a href="/?category=Sex+Doll#new-arrivals" className="block px-4 py-2 text-[10px] text-gray-300 hover:text-luxePink-400 hover:bg-luxePink-500/5 rounded-lg luxury-transition">Sex Dolls</a>
              </div>
            </div>

            <button 
              onClick={() => showToast("Maison Blog is coming soon!", "info")} 
              className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink uppercase tracking-widest text-[12px] font-medium cursor-pointer"
            >
              Blog
            </button>
            <a href={isLoggedIn ? "/profile" : "/auth"} className="hover:text-luxePink-400 luxury-transition hover:text-glow-pink">Track Order</a>
          </nav>

          {/* Right Section: Icons and CTA Button */}
          <div className="hidden lg:flex items-center gap-5">

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
          <div className="lg:hidden flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  router.push('/profile');
                } else {
                  router.push('/auth');
                }
              }}
              className="text-white hover:text-luxePink-500 cursor-pointer transition duration-300 p-2"
            >
              <i className="fa-regular fa-user text-xl"></i>
            </button>
            <div onClick={toggleCart} className="relative cursor-pointer text-luxePink-500 p-2">
              <i className="fa-solid fa-bag-shopping text-xl"></i>
              <span className="absolute top-0 right-0 bg-white text-velvet-400 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">{cartItemCount}</span>
            </div>
            <button onClick={toggleMobileMenu} className="text-white hover:text-luxePink-500 transition duration-300 p-2 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
