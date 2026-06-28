"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "../context/AppContext";

export default function Footer() {
  const { showToast, setSearchQuery } = useAppContext();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      showToast("Please input a valid email address.", "error");
      return;
    }
    showToast("Patron Subscription Complete! Welcome to the Maison Gazette.", "success");
    setEmail("");
  };

  const handleLinkClick = (category: string) => {
    setSearchQuery(category.toLowerCase());
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-velvet-300 via-velvet-400 to-velvet-500 text-gray-400 pt-20 pb-8 border-t border-luxePink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="adultDesire Logo"
                className="h-24 w-auto object-contain rounded-md"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
              adultDesire represents the global vanguard of pure midnight purple and orchid pink themed wellness products. We partner with the world's finest ateliers to curate, authenticate, and transport certified assets directly to elite collectors.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 hover:border-luxePink-500 hover:text-white luxury-transition hover:pink-border-glow">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 hover:border-luxePink-500 hover:text-white luxury-transition hover:pink-border-glow">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 hover:border-luxePink-500 hover:text-white luxury-transition hover:pink-border-glow">
                <i className="fa-brands fa-pinterest"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 hover:border-luxePink-500 hover:text-white luxury-transition hover:pink-border-glow">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-6">
              THE LUXURY HOUSES
            </h4>
            <ul className="space-y-2 sm:space-y-4 text-xs font-light">
              <li>
                <button onClick={() => handleLinkClick("Watches")} className="hover:text-luxePink-500 transition duration-200 py-1 sm:py-0 text-left">
                  The Chronograph Elite Indices
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("Jewelry")} className="hover:text-luxePink-500 transition duration-200 py-1 sm:py-0 text-left">
                  Imperial VVS Rose Jewelry
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("Leather Goods")} className="hover:text-luxePink-500 transition duration-200 py-1 sm:py-0 text-left">
                  Orchid Strap Leather Carryalls
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("Fragrances")} className="hover:text-luxePink-500 transition duration-200 py-1 sm:py-0 text-left">
                  Elixirs, Perfumes & Colognes
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick("Apparel")} className="hover:text-luxePink-500 transition duration-200 py-1 sm:py-0 text-left">
                  Exclusive Luxury Outerwear
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-6">
              POLICIES
            </h4>
            <ul className="space-y-4 text-xs font-light text-gray-400">
              <li>
                <Link href="/returns" className="hover:text-luxePink-500 transition duration-200">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-luxePink-500 transition duration-200">
                  Shipping & Customs
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-luxePink-500 transition duration-200">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-luxePink-500 transition duration-200">
                  Privacy & Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-luxePink-500 transition duration-200">
                  Terms & Condition
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white font-bold mb-6">
              THE MAISON GAZETTE
            </h4>
            <p className="text-xs text-gray-400 mb-4 font-light">
              Join our priority subscription register to receive private launch invitations, seasonal catalog drops, and VIP runway access.
            </p>
          </div>
        </div>



        <div className="border-t border-luxePink-500/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] tracking-widest uppercase text-gray-500">
          <p>&copy; 2026 adultDesire. ALL RIGHTS RESERVED WORLDWIDE.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-luxePink-500 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-luxePink-500 transition">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
