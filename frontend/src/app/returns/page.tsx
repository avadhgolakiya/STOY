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
            At <span className="text-white font-medium">Naughtynights.in</span>, we maintain the highest standards of hygiene and health safety. Because of the intimate nature of our products, our return and exchange guidelines are strictly enforced to protect all customers.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Intimate Hygiene & Safety Restriction
            </h2>
            <p>
              Due to health, personal hygiene, and safety considerations, adult and intimate wellness products <span className="text-white font-medium">cannot be returned or exchanged once opened, used, or if the safety seal has been tampered with</span>. 
            </p>
            <p className="mt-2">
              We inspect all dispatched orders to verify their pristine condition. We ask that you verify all specifications, sizes, and compatibility prior to finalizing your order.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Eligible Return Criteria
            </h2>
            <p>
              We accept return requests under these specific circumstances:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li>
                <span className="text-white font-medium">Transit Damage:</span> The product arrived physically damaged or broken during shipping.
              </li>
              <li>
                <span className="text-white font-medium">Manufacturing Defect:</span> The electronic device has an inherent manufacturing issue or fails to power on out of the box.
              </li>
              <li>
                <span className="text-white font-medium">Incomplete or Wrong Delivery:</span> You received a product completely different from the one ordered.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Reporting Window & Process
            </h2>
            <p>
              All eligible issues must be reported to our support team <span className="text-white font-medium">within 48 hours of delivery</span>. 
            </p>
            <p className="mt-2">
              To submit a return/exchange claim, please contact support and provide:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1 pl-4">
              <li>Your order number and proof of purchase.</li>
              <li>A short video or photo demonstrating the defect, damage, or wrong item.</li>
              <li>Images showing the original packaging box with the shipping label intact.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              Return Shipping Fees
            </h2>
            <p>
              Once your return request is officially approved by our support team, <span className="text-white font-medium">the buyer will have to bear all the costs for return shipping</span> to dispatch the item back to our centralized fulfillment vault. 
            </p>
            <p className="mt-2">
              Upon receiving and verifying the returned package, we will process the replacement dispatch or initiate your refund according to our Refund Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
