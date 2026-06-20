"use client";

import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function ConciergeForm() {
  const { showToast } = useAppContext();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast("VIP Consultation dispatch request sent successfully.", "success");
  };

  return (
    <section id="concierge" className="py-24 bg-velvet-300 relative border-b border-luxePink-500/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-luxePink-500 text-xs tracking-[0.4em] block mb-3 text-glow-pink">
            PRIVATE CLIENT SERVICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-widest uppercase text-glow-pink">
            Request VIP Consultation
          </h2>
          <div className="h-[1px] w-24 bg-luxePink-500/30 mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-lg mx-auto font-light">
            Commission custom chronographs, request private viewings, or communicate custom jewelry sizing directly with our atelier design leads.
          </p>
        </div>

        {!isSubmitted ? (
          <form
            id="conciergeForm"
            onSubmit={handleSubmit}
            className="bg-velvet-400/90 border border-luxePink-500/20 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxePink-700 via-luxePink-500 to-luxePink-300"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxePink-500 mb-3 font-semibold">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Harrington"
                  className="w-full bg-velvet-300/80 border border-luxePink-500/20 rounded-xl py-3.5 px-5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-luxePink-500 mb-3 font-semibold">
                  VIP Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. r.harrington@private.com"
                  className="w-full bg-velvet-300/80 border border-luxePink-500/20 rounded-xl py-3.5 px-5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-luxePink-500 mb-3 font-semibold">
                  Selected Atelier Preference *
                </label>
                <select className="w-full bg-velvet-300/80 border border-luxePink-500/20 rounded-xl py-3.5 px-5 text-white text-xs focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow">
                  <option value="bespoke-chronos">Bespoke Chronograph Commissions (Rolex/AP/Maison Editions)</option>
                  <option value="royal-gems">Private Imperial Jewelry Fitting & Stone Settings</option>
                  <option value="leather-craft">Custom Sized Leather Backpacks & Couture Goods</option>
                  <option value="patron-membership">Maison Privé Club Exclusive VIP Membership Tier</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-luxePink-500 mb-3 font-semibold">
                  Exclusive Instructions or Special Sizing Details
                </label>
                <textarea
                  rows={5}
                  placeholder="Specify gemstone details, metal variations, or private courier preferences..."
                  className="w-full bg-velvet-300/80 border border-luxePink-500/20 rounded-xl py-3.5 px-5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-luxePink-500 luxury-transition hover:pink-border-glow focus:pink-border-glow"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-10 bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-velvet-400 font-bold uppercase tracking-[0.2em] text-xs py-4.5 rounded-xl luxury-transition pink-border-glow flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-paper-plane"></i> Dispatch Premium Invitation Request
            </button>
          </form>
        ) : (
          <div id="form-success" className="mt-8 bg-luxePink-950/20 border border-luxePink-500 text-luxePink-500 p-8 rounded-2xl text-center">
            <i className="fa-solid fa-circle-check text-3xl mb-4 block"></i>
            <p className="font-cinzel font-bold text-lg uppercase tracking-widest">
              Invitation Request Submitted Privately
            </p>
            <p className="text-xs text-gray-300 mt-2 font-light">
              A designated Luxury Portfolio Concierge will contact you securely within 2 hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
