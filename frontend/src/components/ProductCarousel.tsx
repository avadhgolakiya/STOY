"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// --- Skeleton Shimmer Bar ---
function ShimmerBar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-white/10 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style jsx global>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmerSweep 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}

// --- Skeleton Card ---
function ProductCardSkeleton() {
  return (
    <div 
      className="w-full flex-shrink-0 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_8px_40px_rgba(79,70,229,0.25)] h-[500px]"
    >
      <ShimmerBar className="h-52 w-full rounded-2xl" />
      <ShimmerBar className="h-4 w-20 rounded" />
      <div className="space-y-2">
        <ShimmerBar className="h-5 w-full rounded" />
        <ShimmerBar className="h-5 w-3/4 rounded" />
      </div>
      <div className="flex gap-2 items-center">
        <ShimmerBar className="h-4 w-20 rounded" />
        <ShimmerBar className="h-3 w-10 rounded" />
      </div>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
        <ShimmerBar className="h-6 w-16 rounded" />
        <ShimmerBar className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
}

export default function ProductCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Spring animation configuration ---
  const indexSpring = useSpring(0, { stiffness: 280, damping: 28, bounce: 0 });
  const x = useTransform(indexSpring, (v) => -v);
  const translateX = useMotionTemplate`translateX(${x}%)`;

  // --- Fetch Products on Mount ---
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load carousel products:", err);
        setLoading(false);
      });
  }, []);

  // --- Dispatch Custom Slide Event for Three.js Burst ---
  useEffect(() => {
    if (products.length === 0) return;
    indexSpring.set(activeIndex * 100);
    window.dispatchEvent(
      new CustomEvent("carousel:slide", { detail: { index: activeIndex } })
    );
  }, [activeIndex, products.length, indexSpring]);

  // --- Autoplay Config (Every 4 seconds) ---
  const startAutoplay = () => {
    stopAutoplay();
    if (products.length <= 1) return;
    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 4000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!loading && !isHovered) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay();
  }, [loading, isHovered, products.length]);

  // --- Navigation Controls ---
  const handleNext = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
    if (!isHovered) startAutoplay(); // Reset autoplay timer
  };

  const handlePrev = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
    if (!isHovered) startAutoplay(); // Reset autoplay timer
  };

  // --- Keyboard Listeners ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [products.length, isHovered]);

  // --- Mobile Drag/Swipe Swipe handling ---
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 60;
    const velocityThreshold = 300;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -threshold || velocity < -velocityThreshold) {
      handleNext();
    } else if (offset > threshold || velocity > velocityThreshold) {
      handlePrev();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto py-20 px-6 relative z-10">
        <ProductCardSkeleton />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-[280px] sm:max-w-[340px] mx-auto py-16 overflow-visible z-10"
    >
      {/* Slider Track Wrapper */}
      <div className="w-full overflow-visible relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          style={{ transform: translateX, transformStyle: "preserve-3d" }}
          className="flex w-full cursor-grab active:cursor-grabbing"
        >
          {products.map((product, idx) => {
            const isActive = idx === activeIndex;

            return (
              <motion.div
                key={product.id}
                animate={{
                  scale: isActive ? 1 : 0.82,
                  opacity: isActive ? 1 : 0.45,
                  filter: isActive ? "blur(0px)" : "blur(2px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                }}
                className="w-full flex-shrink-0 origin-center px-2 select-none"
              >
                {/* Product Card Glassmorphism */}
                <div 
                  className="rounded-[24px] bg-white/5 border border-white/12 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_8px_40px_rgba(79,70,229,0.25)] h-[500px]"
                >
                  {/* Image Container */}
                  <div className="h-52 w-full rounded-2xl bg-white/10 p-4 relative overflow-hidden flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={240}
                      height={200}
                      className="max-h-full max-w-full object-contain"
                      priority={isActive}
                      draggable={false}
                    />
                  </div>

                  {/* Category Pill */}
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    {product.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-white text-base font-semibold line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  {/* Star Rating Row */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => {
                        const filled = i < Math.round(product.rating.rate);
                        return (
                          <span 
                            key={i} 
                            className={`text-xs ${filled ? "text-indigo-400" : "text-white/20"}`}
                          >
                            ★
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-xs text-neutral-400 font-light mt-0.5">
                      ({product.rating.count} reviews)
                    </span>
                  </div>

                  {/* Price and Action Button */}
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                    <span className="text-xl font-bold text-white tracking-wide">
                      ${product.price.toFixed(2)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all select-none cursor-pointer"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Frosted Control Arrows (AnimatePresence fade-in on hover) */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Prev Arrow */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.8, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={handlePrev}
              className="absolute left-[-50px] top-[calc(50%-20px)] h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-lg cursor-pointer z-20"
            >
              ←
            </motion.button>

            {/* Next Arrow */}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.8, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              onClick={handleNext}
              className="absolute right-[-50px] top-[calc(50%-20px)] h-10 w-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-lg cursor-pointer z-20"
            >
              →
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {products.map((_, idx) => {
          const isActive = idx === activeIndex;

          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="focus:outline-none relative h-2 cursor-pointer"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <motion.div
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? "rgba(129, 140, 248, 1)" : "rgba(255, 255, 255, 0.3)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="h-2 rounded-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
