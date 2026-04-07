import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryStrip from "@/components/home/CategoryStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import UspBanner from "@/components/home/UspBanner";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import AboutSnippet from "@/components/home/AboutSnippet";
import InstagramFeed from "@/components/home/InstagramFeed";
import NewsletterSection from "@/components/home/NewsletterSection";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "houseof swaishq collections — Premium Indian Women's Fashion",
  description:
    "Shop premium co-ord sets, kurti sets and dresses for Indian women. Modern, chic, confident fashion for every occasion.",
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CategoryStrip />
      <Suspense
        fallback={
          <div className="py-16 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <UspBanner />
      <Suspense fallback={null}>
        <TrendingCarousel />
      </Suspense>
      <AboutSnippet />
      <InstagramFeed />
      <NewsletterSection />
    </>
  );
}
