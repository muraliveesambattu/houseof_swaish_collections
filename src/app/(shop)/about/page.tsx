import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us — The Co-Ord Set Studio",
  description:
    "Celebrating Indian femininity through thoughtfully designed co-ord sets and ethnic wear.",
};

const values = [
  {
    icon: "✦",
    title: "Crafted with Intent",
    body: "Every piece is designed for the woman who moves through life with purpose — from morning chai to evening celebrations.",
  },
  {
    icon: "✦",
    title: "Premium Fabrics",
    body: "We source breathable, skin-friendly fabrics — pure cottons, chanderi silks, and georgettes — that honour the Indian climate.",
  },
  {
    icon: "✦",
    title: "Ethical Production",
    body: "Made in small batches by skilled artisans across Jaipur and Surat, ensuring fair wages and zero overproduction.",
  },
  {
    icon: "✦",
    title: "Easy Returns",
    body: "Loved by 10,000+ women across India. If it doesn't feel right, hassle-free returns within 7 days.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F4]">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-sm tracking-[0.2em] uppercase text-[#C9A6A6] mb-4">
          Our Story
        </p>
        <h1 className="font-heading text-5xl md:text-6xl text-[#2C2C2A] leading-tight mb-6">
          Dressing the Modern
          <br />
          Indian Woman
        </h1>
        <p className="font-body text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          The Co-Ord Set Studio was born from a simple observation: Indian women deserve
          co-ordinated, effortless outfits that honour their heritage while fitting
          seamlessly into contemporary life.
        </p>
      </section>

      {/* Image + founder note */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-gray-100">
          <Image
            src="/images/about-founder.jpg"
            alt="Founder — The Co-Ord Set Studio"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-[#C9A6A6] mb-3">
            A note from the founder
          </p>
          <blockquote className="font-heading text-2xl text-[#2C2C2A] leading-snug mb-6">
            &ldquo;I wanted to make getting dressed feel like self-care, not a
            chore.&rdquo;
          </blockquote>
          <p className="font-body text-gray-500 leading-relaxed mb-4">
            Growing up watching my mother drape a sari with quiet confidence, I
            always believed Indian clothing carried a certain magic. TCSS is my
            attempt to bottle that magic into everyday pieces — co-ord sets you
            reach for on a Tuesday morning, not just for weddings.
          </p>
          <p className="font-body text-gray-500 leading-relaxed">
            Every collection is a conversation between tradition and modernity,
            between the woman you are and the woman you&apos;re becoming.
          </p>
          <p className="font-heading text-xl text-[#2C2C2A] mt-6">— Priya S.</p>
          <p className="font-body text-sm text-gray-400">Founder, TCSS</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-heading text-4xl text-[#2C2C2A] text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <span className="text-[#C9A6A6] text-xl mt-1">{v.icon}</span>
                <div>
                  <h3 className="font-body font-semibold text-[#2C2C2A] mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
