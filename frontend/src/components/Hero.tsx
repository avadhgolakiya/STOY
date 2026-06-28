"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { heroSlides } from "../data/products";
import { TypewriterEffectSmooth } from "./TypewriterEffect";

export default function Hero() {
  const [slides, setSlides] = useState<any[]>(heroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animateTypewriter, setAnimateTypewriter] = useState(true);

  useEffect(() => {
    if (currentSlide > 0) {
      setAnimateTypewriter(false);
    }
  }, [currentSlide]);

  const DURATION = 4000;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const touchStartX = useRef(0);
  const elapsedRef = useRef<number>(0);

  const goTo = useCallback((n: number) => {
    if (slides.length === 0) return;
    elapsedRef.current = 0;
    setProgress(0);
    setCurrentSlide(((n % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  const startProgress = useCallback((resumeTime = 0) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimeRef.current = performance.now() - resumeTime;

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    
    const remainingTime = DURATION - resumeTime;
    timerRef.current = setTimeout(() => {
      elapsedRef.current = 0;
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, remainingTime);
  }, [slides.length]);

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
            setSlides([...heroSlides, ...mapped]);
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
    if (!paused) {
      startProgress(elapsedRef.current);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, paused, startProgress, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(currentSlide + (dx < 0 ? 1 : -1));
  };

  // Safe slide selection to prevent out of bounds when list changes
  const slide = slides[currentSlide] || slides[0] || heroSlides[0];

  const isPhotoOnly = !(slide?.title || slide?.desc);

  const descWords = slide?.descWords || (slide?.desc
    ? slide.desc.split(" ").map((word: string) => ({ text: word }))
    : []);

  return (
    <section 
      id="hero" 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative bg-velvet-500 overflow-hidden flex items-center ${
        isPhotoOnly ? "h-[191px] sm:h-[90vh]" : "min-h-[75vh] sm:h-[90vh] py-4 sm:py-0"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-velvet-400 via-velvet-400/75 to-transparent z-10 ${isPhotoOnly ? 'hidden' : ''}`}></div>
      <div className={`absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-velvet-400 to-transparent z-10 ${isPhotoOnly ? 'hidden' : ''}`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div id="hero-slider" className="relative">
          {!isPhotoOnly ? (
            <div className="slide-item transition-all duration-1000 transform opacity-100 translate-x-0 pt-5 sm:pt-0 max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              {slide?.badge ? (
                slide.badgeType === "pill" ? (
                  <span className="inline-block bg-[#52092b] text-white text-[7.5px] sm:text-[11px] uppercase tracking-normal sm:tracking-[0.15em] font-bold px-2.5 py-1 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-6 border border-luxePink-500/30">
                    {slide.badge}
                  </span>
                ) : (
                  <span className="text-luxePink-500 text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold block mb-4 text-glow-pink">
                    {slide.badge}
                  </span>
                )
              ) : (
                <span className="text-luxePink-500 text-xs sm:text-sm uppercase tracking-[0.35em] font-semibold block mb-4 text-glow-pink">
                  CURATED COUTURE & PRIVATE ACCESS
                </span>
              )}
              {slide?.titleWords ? (
                <h1 className={`text-[1.35rem] xs:text-2xl sm:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6 ${slide?.titleClass || "font-cinzel text-white"}`}>
                  <TypewriterEffectSmooth
                    key={`title-${currentSlide}`}
                    words={slide.titleWords}
                    triggerKey={currentSlide}
                    animate={animateTypewriter}
                    cursorClassName="h-6 sm:h-12 lg:h-16 w-[3px] sm:w-[4px]"
                  />
                </h1>
              ) : (
                <h1
                  className={`text-[1.35rem] xs:text-2xl sm:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6 ${
                    slide?.titleClass || "font-cinzel text-white"
                  }`}
                  dangerouslySetInnerHTML={{ __html: slide?.title || "" }}
                ></h1>
              )}
              <div className="text-gray-300 text-[11px] sm:text-base max-w-xl mb-4 sm:mb-10 leading-relaxed font-light px-4 sm:px-0 min-h-[3rem] sm:min-h-[2.5rem] flex items-center justify-center sm:justify-start">
                {descWords.length > 0 && (
                  <TypewriterEffectSmooth
                    key={currentSlide} // Reset animation on slide change
                    words={descWords}
                    triggerKey={currentSlide}
                    animate={animateTypewriter}
                  />
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-5 max-sm:w-full max-sm:px-6">
                {slide?.buttons ? (
                  slide.buttons.map((btn: any, idx: number) => {
                    if (btn.primary) {
                      return (
                        <a
                          key={idx}
                          href={btn.link}
                          className="flex items-center justify-center bg-gradient-to-r from-luxePink-600 to-luxePink-400 hover:from-luxePink-500 hover:to-luxePink-300 text-white font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-6 py-2.5 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-luxePink-500/10 text-center"
                        >
                          {btn.showBagIcon && <i className="fa-solid fa-bag-shopping mr-2"></i>}
                          {btn.text}
                        </a>
                      );
                    } else {
                      return (
                        <a
                          key={idx}
                          href={btn.link}
                          className="flex items-center justify-center border border-white/35 hover:border-white hover:bg-white/10 text-white font-semibold uppercase tracking-widest text-[10px] sm:text-[11px] px-6 py-2.5 sm:py-4 rounded-full transition-all duration-300 text-center"
                        >
                          {btn.text}
                        </a>
                      );
                    }
                  })
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* Mobile Slider Navigation for slides with text overlay */}
              <div className="flex sm:hidden items-center gap-4 mt-12 justify-center z-20">
                <button
                  onClick={() => goTo(currentSlide - 1)}
                  className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-2 rounded-full bg-velvet-400/60"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="flex gap-2.5">
                  {slides.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                        } h-1.5 rounded transition-all duration-300 cursor-pointer`}
                    ></span>
                  ))}
                </div>
                <button
                  onClick={() => goTo(currentSlide + 1)}
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
            onClick={() => goTo(currentSlide - 1)}
            className="text-luxePink-500 hover:text-white transition-all text-xs"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => goTo(idx)}
                className={`${idx === currentSlide ? "w-6 bg-luxePink-500" : "w-1.5 bg-white/40"
                  } h-1 rounded transition-all duration-300 cursor-pointer`}
              ></span>
            ))}
          </div>
          <button
            onClick={() => goTo(currentSlide + 1)}
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
          className={`w-full h-full object-cover transition-all duration-1000 scale-105 ${
            slide?.bgPosition || "object-center"
          } ${
            isPhotoOnly ? "opacity-100" : (slide?.bgOpacity || "opacity-40")
          }`}
          alt="Luxury backdrop"
        />
      </div>

      <div className="hidden sm:flex absolute bottom-12 right-16 z-20 items-center gap-6">
        <button
          onClick={() => goTo(currentSlide - 1)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="flex gap-2.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              onClick={() => goTo(idx)}
              className={`${idx === currentSlide ? "w-8 bg-luxePink-500" : "w-3 bg-luxePink-900"
                } h-1.5 rounded transition-all duration-300 cursor-pointer`}
            ></span>
          ))}
        </div>
        <button
          onClick={() => goTo(currentSlide + 1)}
          className="text-luxePink-500 hover:text-white transition-all text-sm border border-luxePink-500/20 hover:border-luxePink-500 p-3.5 rounded-full bg-velvet-400/60"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Progressive loading timer bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-luxePink-500 z-30 transition-none"
        style={{ width: `${progress}%` }}
      />
    </section>
  );
}
