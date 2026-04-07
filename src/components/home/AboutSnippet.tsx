import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function AboutSnippet() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#BA7517] mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-[#2C2C2A] leading-tight">
              Where Tradition Meets Contemporary Grace
            </h2>
          </div>
          <div className="space-y-4 font-body text-gray-600 leading-relaxed">
            <p>
              The Co-Ord Set Studio was born from a simple belief — that Indian women deserve fashion that celebrates their strength, beauty, and cultural richness without compromising on modern sensibility.
            </p>
            <p>
              Every piece we create is a conversation between heritage and today. Our co-ord sets, kurti sets, and dresses are crafted from premium fabrics sourced across India, designed to make you feel effortlessly elegant — at a festive gathering, at work, or simply living your everyday life beautifully.
            </p>
          </div>
          <div className="w-12 h-px bg-[#BA7517]" />
          <Link href="/about">
            <Button variant="outline" size="md">
              Read Our Story
            </Button>
          </Link>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"
            alt="Brand lifestyle — Indian woman in elegant co-ord set"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-6 left-6 bg-[#FAF7F4]/95 px-5 py-3 rounded-sm shadow-card">
            <p className="font-heading text-sm text-[#2C2C2A]">
              &ldquo;Crafted with love for Indian women&rdquo;
            </p>
            <p className="font-body text-xs text-[#BA7517] mt-1">
              — Founder, The Co-Ord Set Studio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
