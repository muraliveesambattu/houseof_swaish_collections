import { Truck, RefreshCw, Star } from "lucide-react";

const usps = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders above ₹999",
  },
  {
    icon: Star,
    title: "Premium Quality Fabrics",
    subtitle: "Handpicked fabrics for comfort & elegance",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "7-day hassle-free return policy",
  },
];

export default function UspBanner() {
  return (
    <section className="bg-[#2C2C2A] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
        {usps.map((usp) => (
          <div
            key={usp.title}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#C9A6A6]/20 flex items-center justify-center">
              <usp.icon size={22} className="text-[#C9A6A6]" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-white tracking-wide">
                {usp.title}
              </h3>
              <p className="text-gray-400 font-body text-sm mt-0.5">
                {usp.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
