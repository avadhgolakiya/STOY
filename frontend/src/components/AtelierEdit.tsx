"use client";

import { useAppContext } from "../context/AppContext";

export default function AtelierEdit() {
  const { setSearchQuery } = useAppContext();

  const handleSearch = (category: string) => {
    setSearchQuery(category.toLowerCase());
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="collections" className="py-20 bg-gradient-to-b from-velvet-400 to-velvet-300 border-t border-b border-luxePink-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] text-luxePink-500 tracking-[0.4em] uppercase block mb-3 text-glow-pink">
              WORLD CLASS COLLECTION DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-4xl font-cinzel text-white tracking-[0.05em] sm:tracking-[0.1em] uppercase font-bold">
              Shop by Royal Category
            </h2>
            <div className="h-[1px] w-28 bg-luxePink-500/30 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-center items-center">
            <div onClick={() => handleSearch("Watches")} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-luxePink-500/20 group-hover:border-luxePink-500 p-1 sm:p-1.5 transition-all duration-500 bg-velvet-200 pink-border-glow">
                <img
                  src="/flashlight.jpg"
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition duration-500 hue-rotate-[280deg]"
                  alt="Luxury Watches"
                />
                <div className="absolute inset-0 bg-luxePink-500/5 group-hover:bg-transparent transition duration-500"></div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 group-hover:text-luxePink-500 mt-4 transition duration-300">
                FINE HOROLOGY
              </span>
              <span className="text-[9px] text-luxePink-500/70 tracking-widest mt-0.5">CHRONOGRAPHS</span>
            </div>

            <div onClick={() => handleSearch("Jewelry")} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-luxePink-500/20 group-hover:border-luxePink-500 p-1 sm:p-1.5 transition-all duration-500 bg-velvet-200 pink-border-glow">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=350&q=80"
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition duration-500 hue-rotate-[280deg]"
                  alt="Fine Jewelry"
                />
                <div className="absolute inset-0 bg-luxePink-500/5 group-hover:bg-transparent transition duration-500"></div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 group-hover:text-luxePink-500 mt-4 transition duration-300">
                ROYAL JEWELRY
              </span>
              <span className="text-[9px] text-luxePink-500/70 tracking-widest mt-0.5">VVS GOLD & DIAMONDS</span>
            </div>

            <div onClick={() => handleSearch("Leather Goods")} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-luxePink-500/20 group-hover:border-luxePink-500 p-1 sm:p-1.5 transition-all duration-500 bg-velvet-200 pink-border-glow">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=350&q=80"
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition duration-500 hue-rotate-[280deg]"
                  alt="Bags"
                />
                <div className="absolute inset-0 bg-luxePink-500/5 group-hover:bg-transparent transition duration-500"></div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 group-hover:text-luxePink-500 mt-4 transition duration-300">
                LEATHER ATELIER
              </span>
              <span className="text-[9px] text-luxePink-500/70 tracking-widest mt-0.5">COUTURE CARRYALLS</span>
            </div>

            <div onClick={() => handleSearch("Fragrances")} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-luxePink-500/20 group-hover:border-luxePink-500 p-1 sm:p-1.5 transition-all duration-500 bg-velvet-200 pink-border-glow">
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=350&q=80"
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition duration-500 hue-rotate-[280deg]"
                  alt="Fragrances"
                />
                <div className="absolute inset-0 bg-luxePink-500/5 group-hover:bg-transparent transition duration-500"></div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 group-hover:text-luxePink-500 mt-4 transition duration-300">
                PARFUM HOUSE
              </span>
              <span className="text-[9px] text-luxePink-500/70 tracking-widest mt-0.5">ELIXIRS DE PARFUM</span>
            </div>

            <div onClick={() => handleSearch("Apparel")} className="flex flex-col items-center group cursor-pointer col-span-2 lg:col-span-1">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-luxePink-500/20 group-hover:border-luxePink-500 p-1 sm:p-1.5 transition-all duration-500 bg-velvet-200 pink-border-glow mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=350&q=80"
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition duration-500 hue-rotate-[280deg]"
                  alt="Apparel"
                />
                <div className="absolute inset-0 bg-luxePink-500/5 group-hover:bg-transparent transition duration-500"></div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 group-hover:text-luxePink-500 mt-4 transition duration-300 text-center block">
                PRESTIGE COUTURE
              </span>
              <span className="text-[9px] text-luxePink-500/70 tracking-widest text-center block mt-0.5">
                LIMITED APPAREL
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-velvet-400 border-b border-luxePink-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-luxePink-500 text-xs tracking-[0.3em] uppercase block mb-2">CURATED TRENDS</span>
            <h3 className="text-xl sm:text-3xl font-cinzel text-white font-bold">THE ATELIER EDIT</h3>
            <p className="text-xs text-gray-400 mt-2 font-light">
              Deep Dive into Exclusive Velvet Purple & Orchid Pink Color Combinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group overflow-hidden rounded-2xl border border-luxePink-500/10 p-3 bg-velvet-300 luxury-transition hover:border-luxePink-500/30">
              <div className="relative overflow-hidden h-[420px] rounded-xl">
                <img
                  src="/flashlight.jpg"
                  alt="Flash Light"
                  className="w-full h-full object-cover filter contrast-110 brightness-95 luxury-transition group-hover:scale-105 hue-rotate-[280deg]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-velvet-500 via-transparent to-transparent opacity-95"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-luxePink-500 text-[10px] tracking-[0.3em] uppercase block mb-1">
                    ROYAL EXCLUSIVE
                  </span>
                  <h4 className="font-cinzel text-white text-xl font-bold mb-2">Flash Light</h4>
                  <p className="text-xs text-gray-300 font-light mb-4">
                    An exclusive golden flash light with a premium finish. The ultimate combination of luxury and function.
                  </p>
                  <button
                    onClick={() => handleSearch("Flash Light")}
                    className="inline-block text-[10px] text-luxePink-500 uppercase tracking-widest font-bold border-b border-luxePink-500 hover:text-white hover:border-white pb-1 transition duration-300"
                  >
                    View Selected Masterpieces
                  </button>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-luxePink-500/10 p-3 bg-velvet-300 luxury-transition hover:border-luxePink-500/30">
              <div className="relative overflow-hidden h-[420px] rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80"
                  alt="Exclusive Watch"
                  className="w-full h-full object-cover filter contrast-115 brightness-90 luxury-transition group-hover:scale-105 hue-rotate-[280deg]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-velvet-500 via-transparent to-transparent opacity-95"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-luxePink-500 text-[10px] tracking-[0.3em] uppercase block mb-1">
                    TIMELESS CHRONOS
                  </span>
                  <h4 className="font-cinzel text-white text-xl font-bold mb-2">Sovereign Orchid Dials</h4>
                  <p className="text-xs text-gray-300 font-light mb-4">
                    Meticulously engineered swiss calibers nested inside polished rose pink-gold bezels.
                  </p>
                  <button
                    onClick={() => handleSearch("Watches")}
                    className="inline-block text-[10px] text-luxePink-500 uppercase tracking-widest font-bold border-b border-luxePink-500 hover:text-white hover:border-white pb-1 transition duration-300"
                  >
                    View Private Catalogues
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
