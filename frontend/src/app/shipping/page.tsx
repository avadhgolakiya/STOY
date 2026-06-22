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
          Shipping & Delivery Information
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            At <span className="text-white font-medium">Naughtynights.in</span>, your security and privacy are built into every order. We deliver nationwide using discreet packaging and premium delivery networks.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3 text-glow-pink">
              100% Discreet Packaging Guarantee
            </h2>
            <p>
              We completely understand the necessity of absolute confidentiality:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li>All items are wrapped securely and shipped inside <span className="text-white font-semibold">plain, unbranded, and generic outer boxes</span>.</li>
              <li>There is <span className="text-white font-medium">no mention</span> of "Naughtynights.in", "Adult store", or any product description anywhere on the outer box or shipping label.</li>
              <li>The billing descriptor on the shipping label is customized to show a neutral name, ensuring the courier delivery boy and others do not know the nature of the package.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Delivery Coordination & Phone Number Use
            </h2>
            <p>
              Your phone number is used exclusively by our logistics partner for coordinating delivery:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 pl-4">
              <li>The delivery agent will contact you on the phone number provided at the time of delivery.</li>
              <li>Since the parcel is fully concealed and unbranded, your privacy remains completely safe during delivery.</li>
              <li>We also use your phone number to send automated shipment tracking updates.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Processing & Delivery Timelines
            </h2>
            <p>
              Orders are dispatched within 24 to 48 working hours from our central fulfillment vault.
            </p>
            <p className="mt-2">
              While we make every effort to deliver your order quickly, delivery timelines are estimates provided by third-party delivery partners. Standard shipping takes approximately 3 to 7 working days depending on your location (with remote regions requiring slightly more time).
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Delivery Exclusions
            </h2>
            <p>
              Please note that Naughtynights.in is not responsible for any courier delays caused by weather events, holiday closures, incomplete address details, or remote network conditions outside of our direct control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
