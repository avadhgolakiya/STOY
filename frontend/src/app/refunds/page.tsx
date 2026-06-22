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
          Cancellation & Refund Policy
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            At <span className="text-white font-medium">NaughtyNights</span>, we prioritize your privacy and satisfaction. Due to the nature of our products, and to maintain hygiene standards, we have a strict cancellation and refund policy for all purchases. Please read the details below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
              <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">Order Cancellation</h2>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>You may cancel your order before it has been dispatched.</li>
                <li>Once the order is dispatched, it cannot be canceled.</li>
              </ul>
            </div>

            <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
              <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">Prepaid Order Cancellation</h2>
              <p>
                If you cancel a prepaid order before it is dispatched, we will issue <span className="text-white font-medium">Naughty Coins</span> equal to the value of the order. These can be used for future purchases on our website.
              </p>
            </div>
          </div>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
            <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">Refunds</h2>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>
                Refunds are not offered for any orders that have been shipped, as we do not accept returns on intimate toys due to hygiene and safety reasons.
              </li>
              <li>
                In the case of a manufacturing defect or damage to the product upon delivery, please contact us <span className="text-white font-medium">within 24 hours with unboxing video proof</span> of the issue. We will assess the situation and, if eligible, offer an exchange for the same item.
              </li>
            </ul>
          </div>

          <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
            <h2 className="text-white font-medium mb-3 uppercase tracking-wider text-xs font-cinzel">Exchanges</h2>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>Exchanges are only applicable if the product is defective, unused, and returned in its original packaging.</li>
              <li>The exchange is not valid if you simply change your mind or for incorrect products ordered by the customer.</li>
              <li>The buyer must notify us <span className="text-white font-medium">within 24 hours of receiving the product</span> to request an exchange.</li>
              <li>Once your request is approved, you will need to send the product back to us for review.</li>
              <li>After receiving the shipment, our team will inspect the item, and if approved, we will process and dispatch the replacement within 3 working days.</li>
            </ul>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/10 via-luxePink-500/10 to-transparent my-8"></div>

          <p className="text-xs text-gray-400 italic">
            Please ensure to carefully review your order before finalizing it, as we cannot accept returns or refunds once the items are shipped, due to the sensitive nature of our products. If you have any questions, feel free to reach out to our customer support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
