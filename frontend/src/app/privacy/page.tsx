"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy & Security
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            Along with your sexual needs we take care of your Privacy preferences as well. Under no circumstance <span className="text-white font-medium">Naughtynights.in</span> will sell, share or rent any of your personal information beyond what is necessary to complete your order.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-4">
              We believe and follow a very strict privacy policy as follows:
            </h2>
            <ul className="list-disc list-inside space-y-3 pl-2">
              <li>We will never ask for email address or other sensitive information unless it is required for serving you well while processing your order.</li>
              <li>We never sell any of our customers information to any third party.</li>
              <li>After approval, the buyer will have to bear all the costs for return shipping.</li>
              <li>For complete privacy you will not see <span className="text-white font-medium">Naughtynights.in</span> in any of your card or bank statement that you use in order shop with us.</li>
              <li>We keep our security terms uptight, even our employees can never have an access to any of our customers private information unless it is required to serve you.</li>
              <li>By placing an order with us, you authorise us to use your sensitive information in order to serve you better.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-4 text-glow-pink">
              How we use your information:
            </h2>
            
            <div className="space-y-6">
              <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
                <h3 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Shipping address</h3>
                <p>It is used in order to ship your order to the right place. We will never send any other paper works or anything else on this address except the requested order itself.</p>
              </div>

              <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
                <h3 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Phone number</h3>
                <p>It is used for the communication by the delivery boy at the time of delivering your order. Your orders are shipped with the concealed packaging which makes sure that the delivery boy does not get to know what is inside the box.</p>
                <p className="mt-2">Your phone number can also be used in order to send you the shipment tracking numbers or to have your valuable feedback which helps us improve our services.</p>
              </div>

              <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
                <h3 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Financial Information</h3>
                <p>Your Card/bank account information is only used to process the one time transaction authorised by you.</p>
              </div>

              <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
                <h3 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Email Address</h3>
                <p className="mb-3">We use your email address to serve you in the following ways:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>To send you the copy of the order</li>
                  <li>To send you the shipping confirmation</li>
                  <li>To send you a short customer satisfaction survey</li>
                  <li>To send you ‘Reminders’ for products you opt to be reminded for</li>
                  <li>To send you information relating to new products or promotions on the website</li>
                  <li>To send you information about issues that we believe may be of interest to you.</li>
                </ul>
                <p className="mt-3 text-xs text-luxePink-400 font-light">You can anytime unsubscribe from our email services in order to stop communication through email.</p>
              </div>

              <div className="bg-velvet-400/50 p-6 rounded-2xl border border-luxePink-500/10">
                <h3 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Legal Issues</h3>
                <p>If in case a transactions gets involved into a legal dispute: we will be bound to summon the information in form of witness. We would have to furnish requisite information in such cases. If this occurs we will always try to contact the customer first in order to inform the legal obligations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
