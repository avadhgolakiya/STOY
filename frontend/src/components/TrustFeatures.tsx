"use client";

const features = [
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14">
        <rect x="10" y="20" width="44" height="34" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M22 20V16a10 10 0 0 1 20 0v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 36l6 6 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Discreet Packaging",
    desc: "All products will come in plain brown boxes with no brand markings.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14">
        <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      </svg>
    ),
    title: "The Best Quality",
    desc: "All our products are dually checked and verified to meet the highest hygiene standards.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14">
        <rect x="12" y="10" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M20 22h24M20 30h24M20 38h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="48" cy="48" r="8" fill="#150421" stroke="currentColor" strokeWidth="2" />
        <path d="M44 48h8M48 44v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Discreet Billing",
    desc: "Billing appears with the name AdultDesire Pvt. Ltd or similar — no product details.",
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14">
        <path d="M32 8L12 18v16c0 11 8.7 21.3 20 24 11.3-2.7 20-13 20-24V18L32 8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M22 32l6 6 14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Privacy & Security",
    desc: "Your privacy is our highest priority. All data is encrypted and 100% confidential.",
  },
];

export default function TrustFeatures() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-velvet-400 via-velvet-400 to-velvet-500 border-t border-luxePink-500/10 border-b border-luxePink-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] text-luxePink-500 tracking-[0.4em] uppercase block mb-3">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel text-white font-bold uppercase tracking-wide">
            Our Commitment to You
          </h2>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-luxePink-500 to-transparent mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center px-3 sm:px-6 py-8 sm:py-10 rounded-2xl border border-luxePink-500/10 bg-velvet-300/40 hover:bg-velvet-300/70 hover:border-luxePink-500/40 transition-all duration-500 cursor-default relative overflow-hidden"
            >
              {/* Glow blob */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-luxePink-500/5 group-hover:bg-luxePink-500/10 blur-2xl transition-all duration-500" />

              {/* Icon */}
              <div className="text-luxePink-500/70 group-hover:text-luxePink-400 transition-colors duration-300 mb-5 relative z-10 group-hover:scale-110 transform transition-transform duration-300">
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold text-sm sm:text-base font-cinzel uppercase tracking-wider mb-3 relative z-10">
                {f.title}
              </h3>

              {/* Divider */}
              <div className="h-[1px] w-8 bg-luxePink-500/40 group-hover:w-16 transition-all duration-400 mb-3 rounded-full" />

              {/* Description */}
              <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed font-light relative z-10">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
