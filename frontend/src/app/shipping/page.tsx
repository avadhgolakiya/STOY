"use client";

import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-velvet-500 pt-32 pb-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-velvet-400 to-transparent opacity-50 z-0 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 bg-velvet-300/80 backdrop-blur-md border border-luxePink-500/20 p-8 sm:p-12 rounded-3xl shadow-[0_0_40px_rgba(219,39,119,0.1)]">
        <Link 
          href="/" 
          className="inline-flex items-center text-xs text-luxePink-500 hover:text-luxePink-400 uppercase tracking-widest transition duration-200 mb-8"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-cinzel text-white font-extrabold tracking-wide mb-8 text-glow-pink">
          Shipping & Customs
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            At <span className="text-white font-medium">NaughtyNights</span>, we ensure a smooth and discreet shopping experience. All products on <span className="text-white font-medium">Naughtynights.in</span> are 100% customs cleared. The price you see on our website is the final amount you will pay for the product, with all taxes and duties included—there are no hidden charges.
          </p>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
            <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel text-glow-pink">Discreet Packaging & Confidentiality</h2>
            <p>
              To maintain your privacy, we take extra care with our packaging:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 pl-1">
              <li>We never display the <span className="text-white font-medium">Naughtynights.in</span> name or logo on any of our shipments, ensuring that what you're receiving remains fully confidential.</li>
              <li>All products are shipped in plain brown boxes labeled as <span className="text-white font-medium">cell phones or similar products</span>, making it impossible to detect the contents.</li>
            </ul>
          </div>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10 border-amber-500/20">
            <h2 className="text-amber-400 font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">Important Notice</h2>
            <p>
              If your package appears to be opened upon delivery, <span className="text-white font-medium">please inspect the contents before signing for receipt</span>. If any items are missing or not as expected, do not accept the package. Instead, contact us immediately so we can investigate the issue and send you a replacement.
            </p>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/10 via-luxePink-500/10 to-transparent my-8"></div>

          <p className="text-xs text-gray-400 italic">
            Your privacy and satisfaction are our top priorities. Should you have any concerns or queries, our customer support team is here to assist you.
          </p>
        </div>
      </div>
    </div>
  );
}
