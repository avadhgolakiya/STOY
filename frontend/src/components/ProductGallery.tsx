"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Product } from "../data/products";

gsap.registerPlugin(useGSAP);

export default function ProductGallery({ product }: { product: Product }) {
  const thumbnails = [
    { id: 1, filter: "brightness-100" },
    { id: 2, filter: "contrast-125 saturate-50" },
    { id: 3, filter: "grayscale-[20%]" },
    { id: 4, filter: "hue-rotate-15" },
    { id: 5, filter: "sepia-[20%]" },
  ];

  const [activeThumb, setActiveThumb] = useState(thumbnails[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleThumbnailClick = contextSafe((thumb: typeof activeThumb) => {
    if (activeThumb.id === thumb.id) return;
    
    // Animate out
    gsap.to(imageRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveThumb(thumb);
        
        // Setup start state for next image
        gsap.set(imageRef.current, { x: 50, opacity: 0 });
        
        // Animate in
        gsap.to(imageRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    });
  });

  return (
    <div className="lg:w-[45%] flex gap-4 h-[600px]" ref={containerRef}>
      {/* Thumbnails */}
      <div className="w-20 flex flex-col gap-3 overflow-y-auto hidden-scrollbar pr-1">
        {thumbnails.map(thumb => (
          <button 
            key={thumb.id}
            onClick={() => handleThumbnailClick(thumb)}
            className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeThumb.id === thumb.id ? 'border-luxePink-500 shadow-[0_0_15px_rgba(219,39,119,0.3)]' : 'border-transparent hover:border-luxePink-500/50'}`}
          >
            <img 
              src={product.image} 
              alt="thumbnail" 
              className={`w-full h-full object-cover ${thumb.filter} hue-rotate-[290deg]`}
            />
          </button>
        ))}
      </div>
      
      {/* Main Image */}
      <div className="flex-1 bg-velvet-300 rounded-2xl overflow-hidden relative border border-luxePink-500/10 luxury-card-shadow group">
         <img 
           ref={imageRef}
           src={product.image}
           alt={product.title}
           className={`w-full h-full object-cover hue-rotate-[290deg] ${activeThumb.filter} group-hover:scale-105 transition-transform duration-500`}
         />
         <button className="absolute top-4 right-4 w-10 h-10 bg-velvet-400/80 backdrop-blur rounded-full text-white hover:text-luxePink-500 flex items-center justify-center transition border border-luxePink-500/20">
           <i className="fa-solid fa-expand"></i>
         </button>
      </div>
    </div>
  );
}
