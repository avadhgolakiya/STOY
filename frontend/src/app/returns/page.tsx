"use client";

import Link from "next/link";

export default function ReturnsPage() {
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
          Return & Exchange Policy
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            We ensure that every order undergoes thorough quality checks before being shipped, so you can be confident that you’re receiving the highest standard of products. Exchange requests will only be accepted for items with manufacturing defects. To request an exchange, we ask that you record a video while unboxing the package and share it with us within 24 hours of delivery. Please note that exchanges are not applicable for incorrect items ordered.
          </p>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
            <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel text-glow-pink">Exchange Conditions</h2>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>The product must be unused.</li>
              <li>Exchanges are only available for the same model.</li>
              <li>The buyer must notify us <span className="text-white font-medium">within 24 hours of delivery</span> if the product is defective.</li>
              <li>A video showing the unboxing of the product is required for the exchange request.</li>
              <li>The free replacement offer is available for one-time use only.</li>
            </ul>
            <p className="mt-4 text-xs text-luxePink-400">
              Note: Exchange requests are subject to approval by our customer service team.
            </p>
          </div>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
            <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">How to Initiate an Exchange</h2>
            <p>
              Once approved, the buyer is responsible for the return shipping costs. To initiate the exchange process, simply:
            </p>
            <ol className="list-decimal list-inside mt-3 space-y-2 pl-1">
              <li>Take clear photos of the product, packaging, tags, and booklets.</li>
              <li>Contact our support via call or WhatsApp to request the return.</li>
              <li>Upon receiving the returned item, we will inspect it and proceed with the exchange.</li>
            </ol>
            <p className="mt-4">
              Our team will keep you informed via call or WhatsApp throughout the process, ensuring smooth communication until the replacement is completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
