import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy — The Co-Ord Set Studio",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-heading text-5xl text-[#2C2C2A] mb-2">Returns & Exchanges</h1>
        <p className="font-body text-sm text-gray-400 mb-12">Last updated: April 2026</p>

        <div className="prose prose-sm max-w-none font-body text-gray-600 space-y-8">
          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Our Promise</h2>
            <p>We want you to love every piece you wear. If something isn&apos;t right, we&apos;ll make it right — no drama, no lengthy forms.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Return Window</h2>
            <p>You have <strong>7 days</strong> from the date of delivery to initiate a return or exchange. After 7 days, we are unable to accept returns unless the item is defective.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Eligible Items</h2>
            <p>Items must be:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Unworn, unwashed, and in original condition</li>
              <li>Tags intact and packaging included</li>
              <li>Free from perfume, deodorant, or any stains</li>
            </ul>
            <p className="mt-3"><strong>Non-returnable items:</strong> Innerwear, sale items marked &quot;Final Sale&quot;, and customised / altered pieces.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">How to Initiate</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>WhatsApp us at <strong>{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+91 98765 43210"}</strong> with your order number and reason for return.</li>
              <li>We will share a prepaid return label (if eligible) within 24 hours.</li>
              <li>Pack the item securely and hand it to the courier.</li>
              <li>Refund or exchange will be processed within 5–7 business days of receiving the return.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Refund Method</h2>
            <p>Refunds are issued to the original payment method. UPI and card payments are refunded within 5–7 business days. COD orders receive store credit or bank transfer (NEFT).</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Defective or Wrong Items</h2>
            <p>If you received a defective or incorrect item, please WhatsApp us within <strong>48 hours of delivery</strong> with photos. We will arrange a free reverse pickup and send a replacement or full refund at no additional cost.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
