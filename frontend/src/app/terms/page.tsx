"use client";

import Link from "next/link";

export default function TermsPage() {
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
          Terms & Conditions
        </h1>

        <div className="h-[1px] w-full bg-gradient-to-r from-luxePink-500/30 via-luxePink-500/10 to-transparent mb-8"></div>

        <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-8 font-light">
          <p>
            Welcome to <span className="text-white font-medium">AdultDesire.in</span>. By accessing, browsing, or using this website, you agree to comply with and be bound by the following Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the website immediately.
          </p>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              1. Eligibility & Age Restriction
            </h2>
            <p>
              AdultDesire.in sells adult wellness and intimate products intended exclusively for adults. By accessing this website or placing an order, you confirm that you are at least 18 years of age or the legal age required in your jurisdiction.
            </p>
            <p className="mt-2">
              We reserve the right to refuse service, cancel orders, or restrict access if we reasonably believe a user is under the required legal age.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              2. Products & Services
            </h2>
            <p>
              AdultDesire.in offers a variety of adult wellness, intimate care, and pleasure products for personal use.
            </p>
            <p className="mt-2">
              While we strive to ensure that all product descriptions, specifications, pricing, and images are accurate, we do not warrant that all information on the website is complete, current, or error-free. Product images are for illustrative purposes only and may vary slightly from the actual product received.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              3. Orders & Order Acceptance
            </h2>
            <p>
              By placing an order, you agree that all information provided is accurate and complete.
            </p>
            <p className="mt-2">
              All orders are subject to verification, acceptance, and product availability. We reserve the right to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>Refuse or cancel any order.</li>
              <li>Limit quantities purchased.</li>
              <li>Request additional verification before processing.</li>
              <li>Cancel orders involving suspected fraud, misuse, or policy violations.</li>
            </ul>
            <p className="mt-2">
              In the event of cancellation after payment, a refund will be processed according to our refund policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              4. Pricing & Payment
            </h2>
            <p>
              All prices displayed on AdultDesire.in are in Indian Rupees (INR) unless otherwise specified.
            </p>
            <p className="mt-2">
              We accept various payment methods including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>UPI</li>
              <li>Credit Cards / Debit Cards</li>
              <li>Net Banking</li>
              <li>Wallet Payments</li>
              <li>Cash on Delivery (where available)</li>
            </ul>
            <p className="mt-2">
              Prices and offers may change without prior notice. We reserve the right to correct pricing errors and cancel orders affected by such errors.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              5. Shipping & Delivery
            </h2>
            <p>
              Orders are processed and shipped through trusted third-party courier partners.
            </p>
            <p className="mt-2">
              Estimated delivery times are provided for convenience only and are not guaranteed. Delivery delays may occur due to courier issues, weather conditions, public holidays, remote locations, or other circumstances beyond our control. AdultDesire.in shall not be held liable for delays caused by third-party shipping providers.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              6. Discreet Packaging
            </h2>
            <p>
              Your privacy is important to us. All products are shipped in plain, unbranded, and discreet packaging that does not reveal the contents of the parcel.
            </p>
            <p className="mt-2">
              Once a package has been delivered to the shipping address provided by the customer, AdultDesire.in shall not be responsible for any third-party access, mishandling, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              7. Returns, Refunds & Exchanges
            </h2>
            <p>
              Due to hygiene, safety, and personal-use considerations, adult products cannot be returned or exchanged once opened, used, or tampered with.
            </p>
            <p className="mt-2">
              Returns may be accepted only in the following cases:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>Product received is damaged during transit.</li>
              <li>Manufacturing defect.</li>
              <li>Wrong product delivered.</li>
            </ul>
            <p className="mt-2">
              Customers must report such issues within 48 hours of delivery and provide supporting photographs or videos where requested. Approved refunds will be processed through the original payment method within a reasonable timeframe.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              8. Product Usage Disclaimer
            </h2>
            <p>
              All products sold on AdultDesire.in are intended for personal adult wellness purposes only. Customers are responsible for reading and following all product instructions, warnings, and safety guidelines.
            </p>
            <p className="mt-2">
              AdultDesire.in shall not be liable for injuries, damages, health issues, losses, or claims resulting from improper use, misuse, modification of products, or failure to follow instructions.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              9. User Conduct
            </h2>
            <p>
              You agree not to use the website for unlawful purposes, upload malicious software or harmful content, attempt unauthorized access to systems or accounts, interfere with website functionality, or violate any applicable laws or regulations.
            </p>
            <p className="mt-2">
              Violation of these terms may result in immediate suspension or termination of access.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              10. Intellectual Property Rights
            </h2>
            <p>
              All content available on AdultDesire.in, including but not limited to logos, product descriptions, images, graphics, website design, text, and software, is the exclusive property of AdultDesire.in and is protected by applicable intellectual property laws.
            </p>
            <p className="mt-2">
              Unauthorized reproduction, distribution, copying, or modification of any content is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, AdultDesire.in shall not be liable for indirect damages, consequential damages, loss of profits, business interruption, data loss, or personal dissatisfaction with products.
            </p>
            <p className="mt-2">
              Our total liability under any claim shall not exceed the amount paid by the customer for the specific product involved.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              12. Fraud Prevention & Chargebacks
            </h2>
            <p>
              We actively monitor transactions to prevent fraudulent activity. We reserve the right to cancel suspicious orders, request identity verification, block accounts involved in abuse or fraud, and refuse future service where necessary.
            </p>
            <p className="mt-2">
              Customers agree to contact our support team before initiating chargebacks or payment disputes.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              13. Privacy
            </h2>
            <p>
              Your personal information is collected, stored, and processed in accordance with our Privacy Policy. By using this website, you consent to the collection and use of your information as described in the Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              14. Third-Party Services
            </h2>
            <p>
              The website may utilize third-party services including payment gateways, courier providers, analytics tools, and marketing platforms. AdultDesire.in is not responsible for the content, policies, or actions of third-party services and websites.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              15. Modifications to Terms
            </h2>
            <p>
              AdultDesire.in reserves the right to modify, update, or replace these Terms & Conditions at any time without prior notice. Changes become effective immediately upon publication on the website. Continued use of the website constitutes acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              16. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the competent courts located in Ahmedabad, Gujarat, India.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold tracking-wide mb-3">
              17. Contact Information
            </h2>
            <p>
              For questions regarding these Terms & Conditions, please contact us through the Contact Us page available on AdultDesire.in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
