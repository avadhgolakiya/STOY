"use client";

import Link from "next/link";

export default function RefundsPage() {
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
          Refund Policy
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            At <span className="text-white font-medium">Naughtynights.in</span>, we aim to ensure complete satisfaction. Under specific circumstances where a product does not meet expectations due to defects or transit damage, we honor fair refund processes.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Refund Eligibility
            </h2>
            <p>
              Refunds are initiated only for orders that have been approved under our Return & Exchange criteria:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li>The delivered product is confirmed by our team to have transit damage, physical damage, or wrong dispatch.</li>
              <li>A manufacturing defect has been identified and reported within 48 hours of delivery.</li>
              <li>The buyer has shipped the item back to our fulfillment center (with return shipping costs borne by the buyer).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3 text-glow-pink">
              Statement & Bank Privacy
            </h2>
            <p>
              To maintain absolute confidentiality of your purchases:
            </p>
            <p className="mt-2 text-white font-medium bg-velvet-400/50 p-4 rounded-xl border border-luxePink-500/10">
              You will not see "Naughtynights.in" or any adult product description on your credit card, debit card, or bank statement.
            </p>
            <p className="mt-2">
              All electronic card and bank transactions are processed using a neutral generic billing name (e.g., our parent company name) to keep your private shopping activities completely secure and anonymous.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Refund Timeline & Method
            </h2>
            <p>
              Once a returned product has been inspected and approved at our facility, refunds are processed back to the <span className="text-white font-medium">original payment source</span> (UPI, Credit/Debit Card, Net Banking, or Wallet).
            </p>
            <p className="mt-2">
              Approved refunds are credited to your account within 5 to 7 working days, depending on your bank or card network processing cycles.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Order Cancellations
            </h2>
            <p>
              If your order is cancelled by us before shipping (for example, due to a pricing error or out-of-stock inventory), your payment will be refunded immediately back to the original source.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
