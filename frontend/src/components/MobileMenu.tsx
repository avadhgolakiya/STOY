"use client";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function MobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, setSearchQuery, showToast, isLoggedIn } = useAppContext();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNavClick = () => {
    toggleMobileMenu();
  };

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-velvet-300/98 backdrop-blur-xl transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-out border-r border-luxePink-500/10 flex flex-col justify-between p-8`}
    >
      <div>
        <div className="flex justify-between items-center mb-10">
          <img
            src="/logo.png"
            alt="adultDesire Logo"
            className="h-16 w-auto object-contain rounded-md"
          />
          <button
            onClick={toggleMobileMenu}
            className="text-luxePink-500 hover:text-white text-xl p-2 -mr-2"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="relative w-full mb-6">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search luxury products..."
            className="w-full bg-velvet-200 border border-luxePink-500/20 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-luxePink-500 text-xs"></i>
        </div>
        <nav className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.15em] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <a href="/" onClick={handleNavClick} className="text-luxePink-500 font-semibold py-2">
            Home
          </a>
          
          {/* For Men Accordion */}
          <div>
            <button 
              onClick={() => toggleSection("men")}
              className="w-full text-left text-gray-300 hover:text-luxePink-500 py-2 flex justify-between items-center cursor-pointer"
            >
              <span>For Men</span>
              <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${openSection === "men" ? "rotate-180" : ""}`}></i>
            </button>
            <div className={`pl-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openSection === "men" ? "max-h-32 mt-1 mb-2 opacity-100" : "max-h-0 opacity-0"}`}>
              <a href="/?category=masturbators#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Masturbators</a>
              <a href="/?category=cock-rings#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Cock Rings</a>
              <a href="/?category=penis-sleeves#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Penis Sleeves</a>
            </div>
          </div>

          {/* For Women Accordion */}
          <div>
            <button 
              onClick={() => toggleSection("women")}
              className="w-full text-left text-gray-300 hover:text-luxePink-500 py-2 flex justify-between items-center cursor-pointer"
            >
              <span>For Women</span>
              <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${openSection === "women" ? "rotate-180" : ""}`}></i>
            </button>
            <div className={`pl-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openSection === "women" ? "max-h-32 mt-1 mb-2 opacity-100" : "max-h-0 opacity-0"}`}>
              <a href="/?category=vibrators#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Vibrators</a>
              <a href="/?category=dildo#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Dildos</a>
              <a href="/?category=butt-plug#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Butt Plugs</a>
            </div>
          </div>

          {/* For Couples Accordion */}
          <div>
            <button 
              onClick={() => toggleSection("couples")}
              className="w-full text-left text-gray-300 hover:text-luxePink-500 py-2 flex justify-between items-center cursor-pointer"
            >
              <span>For Couples</span>
              <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${openSection === "couples" ? "rotate-180" : ""}`}></i>
            </button>
            <div className={`pl-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${openSection === "couples" ? "max-h-32 mt-1 mb-2 opacity-100" : "max-h-0 opacity-0"}`}>
              <a href="/?category=BDSM#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">BDSM Kits</a>
              <a href="/?category=LUBRICANTS#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Lubricants</a>
              <a href="/?category=Sex+Doll#new-arrivals" onClick={handleNavClick} className="text-[10px] text-gray-400 hover:text-luxePink-400 py-1">Sex Dolls</a>
            </div>
          </div>

          <button 
            onClick={() => {
              handleNavClick();
              showToast("Maison Blog is coming soon!", "info");
            }}
            className="text-left text-gray-300 hover:text-luxePink-500 py-2 uppercase tracking-[0.15em] cursor-pointer"
          >
            Blog
          </button>
          
          <a href={isLoggedIn ? "/profile" : "/auth"} onClick={handleNavClick} className="text-gray-300 hover:text-luxePink-500 py-2">
            Track Order
          </a>
        </nav>
      </div>
      <div className="border-t border-luxePink-500/10 pt-6">
        <p className="text-[8px] text-gray-500 tracking-widest mb-1">PREFERRED MEMBER CARE</p>
        <p className="text-[11px] text-luxePink-500 font-serif">patron@maisonvelours.com</p>
      </div>
    </div>
  );
}
