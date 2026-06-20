"use client";

export default function BrandShowcase() {
  const brands = [
    "HERMÈS NOIR",
    "ROLEX ROSE",
    "CHANEL D'OR",
    "CARTIER PRIVÉ",
    "VERSACE COUTURE",
    "AUDEMARS LUXE",
    "PATEK PHILIPPE",
    "BVLGARI VELOURS"
  ];

  // Duplicate the array to ensure a seamless infinite scroll loop
  // Since we have 3 copies, shifting by -33.333333% loops it perfectly
  const scrollingBrands = [...brands, ...brands, ...brands];

  return (
    <section id="brand-showcase" className="py-16 bg-velvet-500/90 border-b border-luxePink-500/10 overflow-hidden relative">
      <style>{`
        @keyframes brandScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-brand-scroll {
          animation: brandScroll 30s linear infinite;
        }
        .animate-brand-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <p className="text-center text-[10px] text-luxePink-500 tracking-[0.35em] uppercase mb-10">
          CURATED PARTNERS & HOUSES
        </p>
      </div>

      <div className="w-full relative flex overflow-hidden">
        {/* Subtle gradient fades on edges for smooth entry and exit */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#05000A] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#05000A] to-transparent z-20 pointer-events-none"></div>

        <div className="flex animate-brand-scroll w-max items-center">
          {scrollingBrands.map((brand, index) => (
            <div key={index} className="px-8 sm:px-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <span className="font-cinzel font-bold text-xl sm:text-2xl tracking-[0.2em] text-white hover:text-luxePink-400 cursor-pointer luxury-transition hover:text-glow-pink whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
