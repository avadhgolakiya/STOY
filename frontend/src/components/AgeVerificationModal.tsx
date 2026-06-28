"use client";

import React, { useEffect, useState } from "react";

export default function AgeVerificationModal() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isUnderage, setIsUnderage] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const verified = localStorage.getItem("age-verified");
    if (verified !== "true") {
      setShowModal(true);
      // Prevent scrolling of background page when modal is active
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("age-verified", "true");
    setShowModal(false);
    // Restore scrolling
    document.body.style.overflow = "unset";
  };

  const handleReject = () => {
    setIsUnderage(true);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!mounted || !showModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-velvet-500/60 backdrop-blur-md p-4">
      {isUnderage ? (
        /* Underage / Sorry Screen matching site style colors */
        <div className="max-w-md w-full bg-velvet-300/90 border border-red-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden flex flex-col items-center group">
          {/* Glow effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"></div>
          
          {/* Warning Icon */}
          <div className="w-20 h-20 rounded-full border-2 border-red-500/30 flex items-center justify-center mb-6 bg-red-500/5 shadow-lg shadow-red-500/5">
            <span className="text-white text-3xl font-extrabold">🚫</span>
          </div>

          {/* Header */}
          <h2 className="font-cinzel text-white text-xl sm:text-2xl font-bold tracking-widest uppercase mb-3 mt-2">
            Come back when you're 18 or older
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed font-light font-montserrat">
            Sorry, you're not eligible to access this site.
          </p>

          {/* I Made a Mistake Button */}
          <button
            onClick={() => setIsUnderage(false)}
            className="w-full border border-luxePink-500/50 text-luxePink-400 hover:text-white hover:bg-luxePink-500/25 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            I made a mistake
          </button>
        </div>
      ) : (
        /* Normal Age Verification Screen */
        <div className="max-w-md w-full bg-velvet-300/95 border border-luxePink-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden group">
          {/* Glow effect in background */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-luxePink-500/10 rounded-full blur-3xl group-hover:bg-luxePink-500/15 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-all duration-700"></div>

          <div className="flex flex-col items-center">
            {/* 18+ Badge Icon */}
            <div className="w-20 h-20 rounded-full border-2 border-luxePink-500/30 flex items-center justify-center mb-6 bg-luxePink-500/5 shadow-lg shadow-luxePink-500/5">
              <span className="font-cinzel text-white text-2xl font-extrabold tracking-wider">18+</span>
            </div>

            {/* Title */}
            <h2 className="font-cinzel text-white text-xl sm:text-2xl font-bold tracking-widest uppercase mb-4">
              Age Verification
            </h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base mb-8 leading-relaxed font-light font-montserrat">
              The products sold on this store are catering to adults and contain mature content. 
              <span className="block mt-2 font-semibold text-luxePink-400">Are you 18 years of age or older?</span>
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={handleVerify}
                className="flex-1 bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-100 shadow-xl shadow-luxePink-500/10 cursor-pointer"
              >
                Yes, Enter
              </button>
              <button
                onClick={handleReject}
                className="flex-1 border border-white/20 hover:border-white/50 text-gray-400 hover:text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-100 cursor-pointer"
              >
                No, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
