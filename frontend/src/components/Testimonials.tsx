"use client";

import { useState, useEffect } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(3);

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
      }
    };
    fetchTestimonials();

    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000); 
    
    return () => clearInterval(timer);
  }, [totalPages]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setStartX('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragOffset < -100 && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else if (dragOffset > 100 && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (dragOffset < -100 && currentPage === totalPages - 1) {
       setCurrentPage(0); // Loop to start
    } else if (dragOffset > 100 && currentPage === 0) {
       setCurrentPage(totalPages - 1); // Loop to end
    }
    
    setDragOffset(0);
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 bg-velvet-300 relative border-b border-luxePink-500/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
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

        <div 
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div 
            className="flex"
            style={{ 
              transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 1000ms ease-in-out'
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} className={`w-full flex-shrink-0 grid gap-8 ${
                itemsPerPage === 1 ? 'grid-cols-1' : itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}>
                {testimonials.slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage).map((t) => (
                  <div
                    key={t._id}
                    className="bg-velvet-400/90 border border-luxePink-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-luxePink-500/50 transition-all duration-300 pointer-events-none"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxePink-700 via-luxePink-500 to-luxePink-300 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      {t.image ? (
                        <img src={t.image} alt={t.clientName} className="w-10 h-10 rounded-full object-cover border border-luxePink-500/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-luxePink-500/10 border border-luxePink-500/30 flex items-center justify-center text-luxePink-500 font-cinzel font-bold text-lg">
                          {t.clientName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-cinzel text-white text-sm font-bold tracking-widest">
                          {t.clientName}
                        </h4>
                        <p className="text-[10px] text-luxePink-500 uppercase tracking-widest font-semibold">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-fuchsia-400 text-sm"></i>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 text-sm font-light italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentPage(pageIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentPage === pageIndex
                    ? "bg-luxePink-500 scale-125 pink-border-glow"
                    : "bg-luxePink-500/30 hover:bg-luxePink-500/60"
                }`}
                aria-label={`Go to slide ${pageIndex + 1}`}
              ></button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
