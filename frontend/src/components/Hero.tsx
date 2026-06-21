"use client";

import { useState, useEffect } from "react";
import { heroSlides } from "../data/products";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section id="hero" className="relative min-h-[85vh] sm:h-[90vh] bg-velvet-500 overflow-hidden flex items-center py-10 sm:py-0">
      <div className="absolute inset-0 bg-gradient-to-r from-velvet-400 via-velvet-400/75 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-velvet-400 to-transparent z-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div id="hero-slider" className="relative">
          <div className="slide-item transition-all duration-1000 transform opacity-100 translate-x-0 pt-5 sm:pt-0 max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
            <span className="text-luxePink-500 text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold block mb-4 text-glow-pink">
              CURATED COUTURE & PRIVATE ACCESS
            </span>
            <h1
              className="text-[2.5rem] leading-tight sm:text-6xl lg:text-7xl font-cinzel font-bold text-white mb-6"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            ></h1>
            <p
              className="text-gray-300 text-sm sm:text-base max-w-xl mb-10 leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: slide.desc }}
            ></p>
            <div className="flex flex-col sm:flex-row gap-5 max-sm:w-full">
              <a
                href="#new-arrivals"
                className="flex items-center justify-center bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-velvet-400 font-bold uppercase tracking-widest text-[11px] px-8 py-4 sm:px-12 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-luxePink-500/10 text-center"
              >
                Acquire Current Drops
              </a>
              <a
                href="#collections"
                className="flex items-center justify-center border border-luxePink-500/35 hover:border-luxePink-500 hover:bg-luxePink-500/10 text-luxePink-500 font-semibold uppercase tracking-widest text-[11px] px-8 py-4 sm:px-12 sm:py-4 rounded-full transition-all duration-300 text-center"
              >
                Explore The Edits
              </a>
            </div>

            {/* Mobile Slider Navigation (Flows naturally below CTA) */}
            <div className="flex sm:hidden items-center gap-4 mt-12 justify-center z-20">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-2 rounded-full bg-velvet-400/60"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div className="flex gap-2.5">
                {heroSlides.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                      } h-1.5 rounded transition-all duration-300 cursor-pointer`}
                  ></span>
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-2 rounded-full bg-velvet-400/60"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full">
        <img
          key={slide.img} // Re-triggers animation on change
          src={slide.img}
          className="w-full h-full object-cover object-center opacity-40 transition-all duration-1000 scale-105"
          alt="Luxury backdrop"
        />
      </div>

      <div className="hidden sm:flex absolute bottom-12 right-16 z-20 items-center gap-6">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="flex gap-2.5">
          {heroSlides.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                } h-1.5 rounded transition-all duration-300 cursor-pointer`}
            ></span>
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}
