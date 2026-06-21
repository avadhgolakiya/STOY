"use client";

import { useAppContext } from "../context/AppContext";

export default function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, setSearchQuery } = useAppContext();

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-velvet-300/98 backdrop-blur-xl transform ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-out border-r border-luxePink-500/10 flex flex-col justify-between p-8`}
    >
      <div>
        <div className="flex justify-between items-center mb-12">
          <span className="font-cinzel text-xl tracking-widest text-white text-glow-pink">
            ADULT STORE
          </span>
          <button
            onClick={toggleMobileMenu}
            className="text-luxePink-500 hover:text-white text-xl"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="relative w-full mb-8">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search luxury products..."
            className="w-full bg-velvet-200 border border-luxePink-500/20 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-luxePink-500 text-xs"></i>
        </div>
        <nav className="flex flex-col gap-6 text-[12px] uppercase tracking-[0.2em]">
          <a href="#hero" onClick={toggleMobileMenu} className="text-luxePink-500 font-semibold">
            Home
          </a>
          <a href="#collections" onClick={toggleMobileMenu} className="text-gray-300 hover:text-luxePink-500 luxury-transition hover:text-glow-pink">
            The Luxury Edit
          </a>
          <a href="#brand-showcase" onClick={toggleMobileMenu} className="text-gray-300 hover:text-luxePink-500 luxury-transition hover:text-glow-pink">
            Luxury Maisons
          </a>
          <a href="#new-arrivals" onClick={toggleMobileMenu} className="text-gray-300 hover:text-luxePink-500 luxury-transition hover:text-glow-pink">
            New Collections
          </a>
          <a href="#concierge" onClick={toggleMobileMenu} className="text-gray-300 hover:text-luxePink-500 luxury-transition hover:text-glow-pink">
            VIP Concierge Portal
          </a>
        </nav>
      </div>
      <div className="border-t border-luxePink-500/10 pt-8">
        <p className="text-[9px] text-gray-500 tracking-widest mb-2">PREFERRED MEMBER CARE</p>
        <p className="text-[12px] text-luxePink-500 font-serif">patron@maisonvelours.com</p>
      </div>
    </div>
  );
}
