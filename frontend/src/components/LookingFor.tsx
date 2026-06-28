"use client";

import { useRouter } from "next/navigation";

export default function LookingFor() {
  const router = useRouter();

  const handleSelect = (gender: string) => {
    window.location.href = `/?category=${gender}#new-arrivals`;
  };

  return (
    <section className="py-14 sm:py-20 bg-velvet-400 border-b border-luxePink-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[10px] text-luxePink-500 tracking-[0.4em] uppercase block mb-3 text-glow-pink">
            SHOP BY DESIRE
          </span>
          <h2 className="text-2xl sm:text-4xl font-cinzel text-white font-bold tracking-wide uppercase">
            Looking For?
          </h2>
          <div className="h-[1px] w-24 bg-luxePink-500/30 mx-auto mt-4" />
        </div>

        {/* Cards */}
        <div className="flex flex-row justify-center gap-6 sm:gap-12">

          {/* King Card */}
          <div
            onClick={() => handleSelect("masturbators")}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-[140px] h-[160px] sm:w-[240px] sm:h-[280px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-2 border-luxePink-500/20 group-hover:border-luxePink-500 transition-all duration-500 shadow-lg group-hover:shadow-luxePink-500/20 group-hover:shadow-2xl group-hover:scale-105">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b1a4a] via-[#1e082e] to-[#0b0112]" />
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
                alt="King"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-velvet-500/60 via-transparent to-transparent" />
              {/* Gender symbol */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-luxePink-500/20 border border-luxePink-500/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-luxePink-500/40 transition-all duration-300">
                <span className="text-luxePink-400 text-sm sm:text-xl font-bold leading-none">♂</span>
              </div>
              {/* Pink glow on hover */}
              <div className="absolute inset-0 bg-luxePink-500/0 group-hover:bg-luxePink-500/5 transition-all duration-500 rounded-[2rem] sm:rounded-[3rem]" />
            </div>
            <div className="mt-4 text-center">
              <span className="text-white text-sm sm:text-base font-cinzel font-bold uppercase tracking-widest group-hover:text-luxePink-400 transition-colors duration-300">
                King
              </span>
              <div className="h-[2px] w-0 group-hover:w-full bg-luxePink-500 mx-auto mt-1.5 transition-all duration-400 rounded-full" />
            </div>
          </div>

          {/* Queen Card */}
          <div
            onClick={() => handleSelect("vibrators")}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-[140px] h-[160px] sm:w-[240px] sm:h-[280px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-2 border-luxePink-500/20 group-hover:border-luxePink-500 transition-all duration-500 shadow-lg group-hover:shadow-luxePink-500/20 group-hover:shadow-2xl group-hover:scale-105">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a1a3b] via-[#2e081e] to-[#120b0b]" />
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"
                alt="Queen"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-velvet-500/60 via-transparent to-transparent" />
              {/* Gender symbol */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-luxePink-500/20 border border-luxePink-500/40 flex items-center justify-center backdrop-blur-sm group-hover:bg-luxePink-500/40 transition-all duration-300">
                <span className="text-luxePink-400 text-sm sm:text-xl font-bold leading-none">♀</span>
              </div>
              {/* Pink glow on hover */}
              <div className="absolute inset-0 bg-luxePink-500/0 group-hover:bg-luxePink-500/5 transition-all duration-500 rounded-[2rem] sm:rounded-[3rem]" />
            </div>
            <div className="mt-4 text-center">
              <span className="text-white text-sm sm:text-base font-cinzel font-bold uppercase tracking-widest group-hover:text-luxePink-400 transition-colors duration-300">
                Queen
              </span>
              <div className="h-[2px] w-0 group-hover:w-full bg-luxePink-500 mx-auto mt-1.5 transition-all duration-400 rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
