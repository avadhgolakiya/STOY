"use client";

import React, { useState, useEffect } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating?: number;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [rotationAngles, setRotationAngles] = useState<number[]>([]);

  // Generate stable random rotations for the stack layout on mount
  useEffect(() => {
    const angles = testimonials.map(() => Math.floor(Math.random() * 16) - 8);
    setRotationAngles(angles);
  }, [testimonials]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 6000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <div className="max-w-sm md:max-w-5xl mx-auto antialiased font-sans px-4 sm:px-8 lg:px-12 py-4">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20 items-center">
        {/* Left column: stacked images */}
        <div className="flex justify-start md:block">
          <div className="relative h-[380px] w-[100vw] sm:h-[500px] sm:w-96">
            {testimonials.map((testimonial, index) => {
              const isActive = index === active;
              const angle = rotationAngles[index] || 0;
              
              return (
                <div
                  key={index}
                  className="absolute inset-0 origin-bottom transition-all duration-700 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "scale(1) rotate(0deg) translateY(0px)"
                      : `scale(0.92) rotate(${angle}deg) translateY(-40px)`,
                    zIndex: isActive ? 20 : testimonials.length - index,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  {testimonial.src ? (
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center shadow-2xl border border-luxePink-500/20"
                    />
                  ) : (
                    <div className="h-full w-full rounded-3xl bg-velvet-400 border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 font-cinzel font-black text-6xl">
                      {testimonial.name?.charAt(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: textual details */}
        <div className="flex justify-between flex-col py-4 min-h-[300px]">
          <div 
            key={active} 
            className="animate-fade-in-up transition-all duration-300"
          >
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              {testimonials[active].name}
            </h3>
            <p className="text-xs sm:text-sm text-luxePink-500 uppercase tracking-widest font-semibold mt-1">
              {testimonials[active].designation}
            </p>
            {testimonials[active].rating && (
              <div className="flex gap-1 mt-2">
                {[...Array(testimonials[active].rating)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star text-fuchsia-400 text-xs"></i>
                ))}
              </div>
            )}
            
            {/* Word by word typing render simulation */}
            <p className="text-sm sm:text-base text-gray-300 mt-6 leading-relaxed font-light italic">
              "{testimonials[active].quote}"
            </p>
          </div>

          <div className="flex gap-4 pt-8 md:pt-12">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full border border-luxePink-500/20 bg-velvet-400 text-luxePink-500 flex items-center justify-center transition-all duration-300 hover:border-luxePink-500 hover:bg-luxePink-500/10 cursor-pointer group"
            >
              <i className="fa-solid fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform duration-300"></i>
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full border border-luxePink-500/20 bg-velvet-400 text-luxePink-500 flex items-center justify-center transition-all duration-300 hover:border-luxePink-500 hover:bg-luxePink-500/10 cursor-pointer group"
            >
              <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-0.5 transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
