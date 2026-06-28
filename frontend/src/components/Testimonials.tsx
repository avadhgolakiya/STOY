"use client";

import { useState, useEffect } from "react";
import { AnimatedTestimonials } from "./AnimatedTestimonials";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  // Map database properties to component inputs
  const mappedTestimonials = testimonials.map((t: any) => ({
    quote: t.quote,
    name: t.clientName,
    designation: t.role,
    src: t.image,
    rating: t.rating || 5,
  }));

  return (
    <section id="testimonials" className="py-16 bg-velvet-300 relative border-b border-luxePink-500/10 overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-luxePink-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-luxePink-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-6">
          <span className="text-luxePink-500 text-xs tracking-[0.4em] block mb-3 text-glow-pink">
            WHAT OUR PATRONS SAY
          </span>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-widest uppercase text-glow-pink">
            Client Testimonials
          </h2>
          <div className="h-[1px] w-24 bg-luxePink-500/30 mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-lg mx-auto font-light">
            Discover why our exclusive clientele continues to trust us with their most prestigious and bespoke acquisitions.
          </p>
        </div>

        <AnimatedTestimonials testimonials={mappedTestimonials} />

      </div>
    </section>
  );
}
