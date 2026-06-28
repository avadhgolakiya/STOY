"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Product } from "../context/AppContext";

gsap.registerPlugin(useGSAP);

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|3gp|flv|wmv)($|\?)/i;
  const isCloudinaryVideo = url.includes('/video/upload/');
  return videoExtensions.test(url) || isCloudinaryVideo;
};

export default function ProductGallery({ product }: { product: Product }) {
  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  
  const thumbnails = allImages.map((img, index) => ({
    id: index + 1,
    url: img
  }));

  const [activeThumb, setActiveThumb] = useState(thumbnails[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

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
      {thumbnails.length > 1 && (
        <div className="w-20 flex flex-col gap-3 overflow-y-auto hidden-scrollbar pr-1">
          {thumbnails.map(thumb => (
            <button 
              key={thumb.id}
              onClick={() => handleThumbnailClick(thumb)}
            className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeThumb.id === thumb.id ? 'border-luxePink-500 shadow-[0_0_15px_rgba(219,39,119,0.3)]' : 'border-transparent hover:border-luxePink-500/50'}`}
            >
              {isVideoUrl(thumb.url) ? (
                <div className="w-full h-full relative bg-black/40 flex items-center justify-center">
                  <video 
                    src={thumb.url} 
                    className="w-full h-full object-cover opacity-75"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <i className="fa-solid fa-play text-xs bg-luxePink-500 p-1.5 rounded-full shadow-[0_0_10px_rgba(219,39,119,0.5)]"></i>
                  </div>
                </div>
              ) : (
                <img 
                  src={thumb.url} 
                  alt="thumbnail" 
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Main Image/Video */}
      <div className="flex-1 bg-velvet-300 rounded-2xl overflow-hidden relative border border-luxePink-500/10 luxury-card-shadow group">
         {activeThumb && isVideoUrl(activeThumb.url) ? (
           <video
             ref={imageRef as any}
             src={activeThumb.url}
             controls
             autoPlay
             muted
             playsInline
             className="w-full h-full object-contain"
           />
         ) : (
           <img 
             ref={imageRef as any}
             src={activeThumb ? activeThumb.url : ''}
             alt={product.title}
             className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
           />
         )}
          <button 
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-velvet-400/80 backdrop-blur rounded-full text-white hover:text-luxePink-500 flex items-center justify-center transition border border-luxePink-500/20"
          >
            <i className="fa-solid fa-expand"></i>
          </button>
       </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && activeThumb && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center animate-fade-in">
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-velvet-400/80 hover:bg-luxePink-500 rounded-full text-white flex items-center justify-center transition-all duration-300 border border-luxePink-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-[110] cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          
          {/* Main Media in Lightbox */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center relative">
            {isVideoUrl(activeThumb.url) ? (
              <video 
                src={activeThumb.url} 
                controls 
                autoPlay 
                playsInline
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              />
            ) : (
              <img 
                src={activeThumb.url} 
                alt={product.title} 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
