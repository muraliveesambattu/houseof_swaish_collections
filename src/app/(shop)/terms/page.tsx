import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — The Co-Ord Set Studio",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-heading text-5xl text-[#2C2C2A] mb-2">Terms & Conditions</h1>
        <p className="font-body text-sm text-gray-400 mb-12">Last updated: April 2026</p>

        <div className="font-body text-gray-600 space-y-8 text-sm leading-relaxed">
          {[
            {
              title: "Acceptance of Terms",
              body: 'By accessing or using thecoordsetstudio.com ("the Site"), you agree to be bound by these Terms & Conditions. If you disagree, please do not use the Site.',
            },
            {
              title: "Products & Pricing",
              body: "We reserve the right to modify prices, discontinue products, or limit quantities at any time. Prices are in Indian Rupees (₹) inclusive of GST. In the event of a pricing error, we will notify you before processing your order.",
            },
            {
              title: "Order Acceptance",
              body: "Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel any order at our discretion, including orders where product or pricing errors exist.",
            },
            {
              title: "Payment",
              body: "Payments are processed securely via Razorpay. We accept UPI, debit/credit cards, net banking, EMI, and Cash on Delivery (COD) for eligible orders. By placing an order, you warrant that you are authorised to use the payment method.",
            },
            {
              title: "Intellectual Property",
              body: "All content on the Site — including images, text, logos, and product designs — is the intellectual property of The Co-Ord Set Studio. Unauthorised reproduction or commercial use is strictly prohibited.",
            },
            {
              title: "Limitation of Liability",
              body: "To the maximum extent permitted by law, The Co-Ord Set Studio shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or services.",
            },
            {
              title: "Governing Law",
              body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
