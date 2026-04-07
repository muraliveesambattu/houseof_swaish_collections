"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
    title: "New Festive\nCollection",
    subtitle: "Effortlessly elegant co-ord sets for every occasion",
    cta: "Shop Now",
    ctaHref: "/collections/new-arrivals",
    textColor: "text-white",
    overlay: "bg-black/30",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=900&q=80",
    title: "Kurti Sets\nRedefined",
    subtitle: "Modern silhouettes with timeless Indian elegance",
    cta: "Explore Kurti Sets",
    ctaHref: "/collections/kurti-sets",
    textColor: "text-white",
    overlay: "bg-black/20",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1508629385573-6bedb71d27f4?w=1800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1508629385573-6bedb71d27f4?w=900&q=80",
    title: "Made for\nYou",
    subtitle: "Premium fabrics. Thoughtful cuts. Confident wear.",
    cta: "View Collection",
    ctaHref: "/collections",
    textColor: "text-white",
    overlay: "bg-black/25",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [paused, next]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 5rem)", minHeight: 480 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero banner"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.image}
            alt={slide.title.replace("\n", " ")}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className={cn("absolute inset-0", slide.overlay)} />

          {/* Text content */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="text-center max-w-2xl">
              <h1
                className={cn(
                  "font-heading text-5xl md:text-7xl leading-tight tracking-tight whitespace-pre-line animate-fade-in",
                  slide.textColor
                )}
              >
                {slide.title}
              </h1>
              <p
                className={cn(
                  "mt-4 font-body text-base md:text-lg animate-slide-up",
                  slide.textColor,
                  "opacity-90"
                )}
              >
                {slide.subtitle}
              </p>
              <div className="mt-8 animate-slide-up">
                <Link href={slide.ctaHref}>
                  <Button
                    variant="gold"
                    size="lg"
                    className="uppercase tracking-widest text-sm"
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === current ? "bg-white w-6" : "bg-white/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
