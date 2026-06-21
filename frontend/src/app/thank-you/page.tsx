"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-velvet-500 pt-32 pb-24 px-6 relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-velvet-400 to-transparent opacity-50 z-0"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10 bg-velvet-300/80 backdrop-blur-md border border-luxePink-500/20 p-10 sm:p-16 rounded-3xl shadow-[0_0_40px_rgba(219,39,119,0.15)] luxury-scale-hover">
        <div className="w-24 h-24 mx-auto bg-luxePink-500/10 rounded-full border border-luxePink-500/30 flex items-center justify-center mb-8 pink-border-glow animate-pulse">
          <i className="fa-solid fa-check text-4xl text-luxePink-500"></i>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-cinzel text-white font-extrabold tracking-wide mb-4">
          Order Confirmed
        </h1>
        
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
          Thank you for your exclusive purchase at Adult store. Your masterpiece is now being prepared for armored delivery. You will receive an email shortly with your certified vault transport tracking details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/profile" 
            className="bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-widest text-[11px] px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-luxePink-500/20 text-center"
          >
            Track Your Order
          </Link>
          <Link 
            href="/#new-arrivals" 
            className="border border-luxePink-500/35 hover:border-luxePink-500 hover:bg-luxePink-500/10 text-luxePink-500 font-semibold uppercase tracking-widest text-[11px] px-8 py-4 rounded-full transition-all duration-300 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
