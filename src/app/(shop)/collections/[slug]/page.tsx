import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/collections/ProductCard";
import SectionHeading from "@/components/shared/SectionHeading";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: category?.name ?? "Collection",
    description: category?.description ?? `Browse our ${category?.name ?? "collection"}`,
  };
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } }).catch(() => null);
  if (!category) notFound();

  const products = await prisma.product
    .findMany({
      where: { categoryId: category.id, isActive: true },
      include: {
        category: { select: { name: true } },
        variants: { select: { size: true, stock: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeading
        title={category.name}
        subtitle={category.description ?? undefined}
        className="mb-10"
      />
      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-heading text-3xl text-gray-300">No products yet</p>
          <p className="font-body text-sm text-gray-400 mt-2">Check back soon!</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
