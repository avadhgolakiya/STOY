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
          Privacy Policy
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            At <span className="text-white font-medium">AdultDesire.in</span> (referred to as "Adult store", "we", "us", or "our"), your privacy is of paramount importance. This Privacy Policy details how we collect, store, protect, and use your personal information when you access, purchase from, or interact with our website.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information necessary to provide you with secure transactions and discreet delivery of your products:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 pl-4">
              <li>
                <span className="text-white font-medium">Personal Identifiable Information:</span> Name, email address, phone number, shipping address, and billing address.
              </li>
              <li>
                <span className="text-white font-medium">Account Details:</span> Credentials used to create an account, password hashes, and purchase histories.
              </li>
              <li>
                <span className="text-white font-medium">Payment Data:</span> Transaction IDs and payment details. We do not store raw card numbers or CVV values; all payments are processed through certified, secure third-party payment gateways.
              </li>
              <li>
                <span className="text-white font-medium">Technical Data:</span> IP address, browser type, device information, and interaction tracking to optimize site performance.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              Your data is processed strictly to support your client experience, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>Processing, verifying, and delivering your orders.</li>
              <li>Sending account verification codes (OTP) and order status updates.</li>
              <li>Providing secure support and addressing inquiries.</li>
              <li>Preventing fraudulent activities, chargebacks, and security breaches.</li>
              <li>Sending optional promotional offers or news regarding the Maison (which you can opt-out of at any time).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              3. Discreet Shipping & Absolute Privacy
            </h2>
            <p>
              To maintain absolute confidentiality, all items are shipped in plain, unbranded packaging. The outer box or label contains no mention of the product description, branding, or the nature of the items inside.
            </p>
            <p className="mt-2">
              We do not sell, rent, trade, or share your personal data with external marketing platforms or unauthorized third parties.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              4. Data Retention & Security
            </h2>
            <p>
              We employ rigorous administrative, technical, and physical security measures to protect your personal information. All web traffic is encrypted using Secure Socket Layer (SSL/TLS) technology.
            </p>
            <p className="mt-2">
              Your personal data is retained only as long as necessary to fulfill the transactions, satisfy legal or taxation obligations, or resolve disputes.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              5. Cookies and Tracker Technologies
            </h2>
            <p>
              We use cookies and similar trackers to keep you logged in, save items to your vault/cart, and analyze site performance. You can choose to disable cookies in your browser settings, though doing so might affect certain features of the shopping experience.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              6. Sharing with Third-Party Providers
            </h2>
            <p>
              We share essential information only with trusted partners to complete your transactions:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li><span className="text-white font-medium">Payment Processors:</span> Razorpay or Stripe to verify and complete payments.</li>
              <li><span className="text-white font-medium">Courier Partners:</span> To dispatch and deliver your discreet parcel.</li>
              <li><span className="text-white font-medium">Hosting & DB Providers:</span> Secure cloud infrastructure hosting our code and databases.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              7. Your Rights
            </h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to out-of-date or incorrect details, or request that we delete your account and personal information (subject to certain overriding legal data retention obligations).
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              8. Changes to this Privacy Policy
            </h2>
            <p>
              We reserve the right to revise this Privacy Policy at any time. Any changes will become effective immediately upon being published on this page. Your continued use of the website represents your agreement to the updated Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your personal data is handled, please contact our support team through the Contact Us page on AdultDesire.in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
