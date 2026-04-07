import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy — The Co-Ord Set Studio",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-heading text-5xl text-[#2C2C2A] mb-2">Shipping Policy</h1>
        <p className="font-body text-sm text-gray-400 mb-12">Last updated: April 2026</p>

        <div className="prose prose-sm max-w-none font-body text-gray-600 space-y-8">
          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Processing Time</h2>
            <p>Orders are processed within 1–2 business days (Monday through Saturday, excluding national holidays). You will receive a shipment confirmation email with your tracking number once your order has shipped.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Delivery Timelines</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-100 rounded-sm text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[#2C2C2A] font-semibold">Zone</th>
                    <th className="px-4 py-2 text-left text-[#2C2C2A] font-semibold">Standard</th>
                    <th className="px-4 py-2 text-left text-[#2C2C2A] font-semibold">Express</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Metro cities (Jaipur, Mumbai, Delhi, Bengaluru…)", "3–5 days", "1–2 days"],
                    ["Tier-2 / Tier-3 cities", "5–7 days", "2–3 days"],
                    ["Remote / rural areas", "7–10 days", "Not available"],
                  ].map(([zone, std, exp]) => (
                    <tr key={zone}>
                      <td className="px-4 py-2">{zone}</td>
                      <td className="px-4 py-2">{std}</td>
                      <td className="px-4 py-2">{exp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Shipping Charges</h2>
            <p>We offer <strong>free standard shipping</strong> on all orders above ₹999. Orders below ₹999 carry a flat shipping fee of ₹69.</p>
            <p className="mt-2">Express shipping is available for ₹149 and is available to select pin codes.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Tracking Your Order</h2>
            <p>Once your order ships, you will receive an SMS and email with your tracking number and a link to track your shipment on the courier partner&apos;s website. You can also track your order from your account dashboard.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Courier Partners</h2>
            <p>We ship via Delhivery, Bluedart, and Ekart Logistics depending on your pin code and order size.</p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Cash on Delivery</h2>
            <p>COD is available on orders up to ₹3,000. A nominal COD handling fee of ₹30 is added at checkout.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
