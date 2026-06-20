export default function RoyalMandate() {
  return (
    <section className="py-24 bg-gradient-to-r from-velvet-500 to-velvet-300 relative overflow-hidden border-t border-b border-luxePink-500/20">
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-luxePink-500/5 filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6 group">
            <div className="relative overflow-hidden rounded-2xl border border-luxePink-500/25 p-2 bg-velvet-300/40">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Jewelry Craft"
                className="rounded-xl w-full h-[32rem] object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-1000 ease-in-out hue-rotate-[290deg]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velvet-400 via-transparent to-transparent opacity-85"></div>
            </div>
            <div className="bg-velvet-400/90 backdrop-blur-md border border-luxePink-500/30 p-6 rounded-xl w-full">
              <span className="text-luxePink-500 text-[9px] tracking-[0.3em] uppercase block mb-1">
                CERTIFIED HERITAGE
              </span>
              <h4 className="font-cinzel text-white text-lg font-bold mb-2">Unparalleled Rose Polish</h4>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Each diamond, stone and metallic alloy undergoes rigorous multi-generational inspections before setting.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-luxePink-500 text-xs uppercase tracking-[0.35em] font-semibold mb-4 block text-glow-pink">
              THE ROYAL MANDATE
            </span>
            <h3 className="text-3xl sm:text-5xl font-cinzel text-white font-bold leading-[1.2] mb-6">
              Exclusivity is <br />
              Not Optional. <br />
              It Is <span className="text-gradient bg-gradient-to-r from-luxePink-500 via-fuchsia-400 to-pink-300 text-transparent bg-clip-text">Everything.</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light mb-10">
              At Adut Store, our vision is absolute alignment with luxury heritage. This curated collection combines precious gems, Swiss-certified dials, and genuine Italian leather under one strict color mandate: Pure Midnight Purple & Imperial Pink.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-luxePink-500/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Lifetime Warranty</h5>
                  <p className="text-[11px] text-gray-400 font-light">
                    Every item carries fully authenticated serial codes and lifetime gold restoration.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-luxePink-500/20 flex items-center justify-center text-luxePink-500 shrink-0">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Armored Concierge</h5>
                  <p className="text-[11px] text-gray-400 font-light">
                    Each shipment travels securely using elite armored carriers with armed security escorts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
