import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/collections/ProductCard";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/ui/Button";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        category: { select: { name: true } },
        variants: { select: { size: true, stock: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        title="Featured Collection"
        subtitle="Our most-loved pieces, curated just for you"
        className="mb-10"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: Number(product.price),
              comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
            }}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/collections">
          <Button variant="outline" size="lg" className="tracking-widest uppercase text-xs">
            View All Products
          </Button>
        </Link>
      </div>
    </section>
  );
}
