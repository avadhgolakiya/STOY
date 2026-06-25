"use client";

import { useState, useEffect } from "react";
import { heroSlides } from "../data/products";

export default function Hero() {
  const [slides, setSlides] = useState<any[]>(heroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
        if (res.ok) {
          const data = await res.json();
          // Filter only active banners
          const activeBanners = data.filter((b: any) => b.isActive);
          if (activeBanners.length > 0) {
            // Map to match the slide structure
            const mapped = activeBanners.map((b: any) => ({
              img: b.image,
              title: b.title,
              desc: b.desc
            }));
            setSlides(mapped);
          } else {
            setSlides(heroSlides);
          }
        }
      } catch (err) {
        console.error("Failed to load hero banners", err);
      }
    };
    getBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  // Safe slide selection to prevent out of bounds when list changes
  const slide = slides[currentSlide] || slides[0] || heroSlides[0];

  const isPhotoOnly = !(slide?.title || slide?.desc);

  return (
    <section 
      id="hero" 
      className={`relative bg-velvet-500 overflow-hidden flex items-center ${
        isPhotoOnly ? "h-[191px] sm:h-[90vh]" : "min-h-[85vh] sm:h-[90vh] py-10 sm:py-0"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-velvet-400 via-velvet-400/75 to-transparent z-10 ${isPhotoOnly ? 'hidden' : ''}`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-velvet-400 to-transparent z-10 ${isPhotoOnly ? 'hidden' : ''}`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div id="hero-slider" className="relative">
          {!isPhotoOnly ? (
            <div className="slide-item transition-all duration-1000 transform opacity-100 translate-x-0 pt-5 sm:pt-0 max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <span className="text-luxePink-500 text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold block mb-4 text-glow-pink">
                CURATED COUTURE & PRIVATE ACCESS
              </span>
              <h1
                className="text-[2.5rem] leading-tight sm:text-6xl lg:text-7xl font-cinzel font-bold text-white mb-6"
                dangerouslySetInnerHTML={{ __html: slide?.title || "" }}
              ></h1>
              <p
                className="text-gray-300 text-sm sm:text-base max-w-xl mb-10 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: slide?.desc || "" }}
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

              {/* Mobile Slider Navigation for slides with text overlay */}
              <div className="flex sm:hidden items-center gap-4 mt-12 justify-center z-20">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-2 rounded-full bg-velvet-400/60"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="flex gap-2.5">
                  {slides.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                        } h-1.5 rounded transition-all duration-300 cursor-pointer`}
                    ></span>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-2 rounded-full bg-velvet-400/60"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Floating Slider Navigation for photo-only slides */}
      {isPhotoOnly && slides.length > 1 && (
        <div className="flex sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 items-center gap-3 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="text-luxePink-500 hover:text-white transition-all text-xs"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`${idx === currentSlide ? "w-6 bg-luxePink-500" : "w-1.5 bg-white/40"
                  } h-1 rounded transition-all duration-300 cursor-pointer`}
              ></span>
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="text-luxePink-500 hover:text-white transition-all text-xs"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}

      <div className="absolute inset-0 w-full h-full">
        <img
          key={slide?.img} // Re-triggers animation on change
          src={slide?.img}
          className={`w-full h-full object-cover object-center transition-all duration-1000 scale-105 ${
            isPhotoOnly ? "opacity-100" : "opacity-40"
          }`}
          alt="Luxury backdrop"
        />
      </div>

      <div className="hidden sm:flex absolute bottom-12 right-16 z-20 items-center gap-6">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="flex gap-2.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                } h-1.5 rounded transition-all duration-300 cursor-pointer`}
            ></span>
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}
