import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide — The Co-Ord Set Studio",
  description: "Find your perfect fit with our detailed size guide for tops, bottoms, and co-ord sets.",
};

const sizes = [
  { size: "XS", chest: "32–33", waist: "25–26", hips: "35–36", shoulder: "13.5" },
  { size: "S",  chest: "34–35", waist: "27–28", hips: "37–38", shoulder: "14" },
  { size: "M",  chest: "36–37", waist: "29–30", hips: "39–40", shoulder: "14.5" },
  { size: "L",  chest: "38–40", waist: "31–33", hips: "41–43", shoulder: "15" },
  { size: "XL", chest: "41–43", waist: "34–36", hips: "44–46", shoulder: "15.5" },
  { size: "2XL",chest: "44–46", waist: "37–39", hips: "47–49", shoulder: "16" },
  { size: "3XL",chest: "47–49", waist: "40–42", hips: "50–52", shoulder: "16.5" },
];

const tips = [
  "Measure over innerwear for accuracy.",
  "Use a soft measuring tape and keep it parallel to the floor.",
  "For a relaxed fit, go one size up. For a fitted silhouette, use your exact measurements.",
  "All measurements are in inches.",
  "If between sizes, we recommend sizing up for tops and down for bottoms.",
];

export default function SizeGuidePage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-[#C9A6A6] mb-3">
            Find Your Fit
          </p>
          <h1 className="font-heading text-5xl text-[#2C2C2A]">Size Guide</h1>
        </div>

        {/* How to measure */}
        <div className="bg-white rounded-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-heading text-2xl text-[#2C2C2A] mb-4">How to Measure</h2>
          <div className="grid md:grid-cols-3 gap-6 font-body text-sm text-gray-600">
            <div>
              <p className="font-semibold text-[#2C2C2A] mb-1">Chest / Bust</p>
              <p>Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
            </div>
            <div>
              <p className="font-semibold text-[#2C2C2A] mb-1">Waist</p>
              <p>Measure around the narrowest part of your natural waist, usually just above the belly button.</p>
            </div>
            <div>
              <p className="font-semibold text-[#2C2C2A] mb-1">Hips</p>
              <p>Measure around the fullest part of your hips, approximately 8 inches below your waist.</p>
            </div>
          </div>
        </div>

        {/* Size table */}
        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FAF7F4]">
                  <th className="px-5 py-3 text-left font-semibold text-[#2C2C2A]">Size</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#2C2C2A]">Chest (in)</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#2C2C2A]">Waist (in)</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#2C2C2A]">Hips (in)</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#2C2C2A]">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sizes.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`${i % 2 === 0 ? "" : "bg-gray-50/50"} hover:bg-[#FAF7F4] transition-colors`}
                  >
                    <td className="px-5 py-3 font-semibold text-[#2C2C2A]">{row.size}</td>
                    <td className="px-5 py-3 text-gray-600">{row.chest}</td>
                    <td className="px-5 py-3 text-gray-600">{row.waist}</td>
                    <td className="px-5 py-3 text-gray-600">{row.hips}</td>
                    <td className="px-5 py-3 text-gray-600">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#C9A6A6]/10 rounded-sm border border-[#C9A6A6]/20 p-6">
          <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">Sizing Tips</h2>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 font-body text-sm text-gray-600">
                <span className="text-[#C9A6A6] mt-0.5">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-gray-500 mt-4">
            Still unsure?{" "}
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210").replace(/\D/g, "")}?text=Hi!%20I%20need%20help%20with%20sizing.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BA7517] underline"
            >
              WhatsApp us
            </a>{" "}
            and we&apos;ll help you find your perfect fit.
          </p>
        </div>
      </div>
    </div>
  );
}
