import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import SectionHeading from "@/components/shared/SectionHeading";

async function getTrendingProducts() {
  try {
    return await prisma.product.findMany({
      where: { isTrending: true, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
      },
      take: 8,
    });
  } catch {
    return [];
  }
}

export default async function TrendingCarousel() {
  const products = await getTrendingProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        title="Trending Now"
        subtitle="What our customers are loving this season"
        className="mb-8"
      />

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex-shrink-0 w-44 md:w-56 group"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 mb-3">
              <Image
                src={product.images[0] || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="220px"
              />
            </div>
            <p className="font-body text-sm font-medium text-[#2C2C2A] group-hover:text-[#BA7517] transition-colors line-clamp-1">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body text-sm text-[#2C2C2A] font-semibold">
                {formatPrice(Number(product.price))}
              </span>
              {product.comparePrice &&
                Number(product.comparePrice) > Number(product.price) && (
                  <span className="font-body text-xs text-gray-400 line-through">
                    {formatPrice(Number(product.comparePrice))}
                  </span>
                )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
