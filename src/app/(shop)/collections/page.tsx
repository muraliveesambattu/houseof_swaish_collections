import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/collections/ProductCard";
import FilterSidebar from "@/components/collections/FilterSidebar";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { SORT_OPTIONS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Collections",
  description: "Browse our full range of co-ord sets, kurti sets and dresses.",
};

interface SearchParams {
  category?: string | string[];
  size?: string | string[];
  color?: string | string[];
  fabric?: string | string[];
  occasion?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  sale?: string;
}

async function getProducts(searchParams: SearchParams) {
  const categories = typeof searchParams.category === "string"
    ? [searchParams.category]
    : searchParams.category ?? [];
  const sizes = typeof searchParams.size === "string"
    ? [searchParams.size]
    : searchParams.size ?? [];
  const fabrics = typeof searchParams.fabric === "string"
    ? [searchParams.fabric]
    : searchParams.fabric ?? [];
  const occasions = typeof searchParams.occasion === "string"
    ? [searchParams.occasion]
    : searchParams.occasion ?? [];

  const where: Record<string, unknown> = { isActive: true };

  if (categories.length > 0) {
    where.category = { slug: { in: categories } };
  }

  if (sizes.length > 0) {
    where.variants = { some: { size: { in: sizes }, stock: { gt: 0 } } };
  }

  if (fabrics.length > 0) {
    where.fabric = { in: fabrics };
  }

  if (occasions.length > 0) {
    where.occasion = { in: occasions };
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {
      ...(searchParams.minPrice ? { gte: Number(searchParams.minPrice) } : {}),
      ...(searchParams.maxPrice ? { lte: Number(searchParams.maxPrice) } : {}),
    };
  }

  if (searchParams.sale === "true") {
    where.comparePrice = { not: null };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (searchParams.sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "bestselling":
      orderBy = { createdAt: "desc" };
      break;
  }

  const page = Number(searchParams.page) || 1;
  const take = 24;
  const skip = (page - 1) * take;

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          variants: { select: { size: true, stock: true } },
        },
        orderBy,
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);
    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / take),
      loadFailed: false,
    };
  } catch (error) {
    console.error("Failed to load collections page products", error);
    return { products: [], total: 0, page, totalPages: 0, loadFailed: true };
  }
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, total, loadFailed } = await getProducts(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-6">Filters</h2>
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-body text-gray-500">
              {total} products
            </p>
            <div className="flex items-center gap-3">
              <select
                defaultValue={params.sort ?? "newest"}
                className="text-sm font-body border border-gray-200 rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:border-[#C9A6A6]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadFailed ? (
            <div className="text-center py-24">
              <p className="font-heading text-3xl text-gray-300 mb-3">
                We couldn&apos;t load products
              </p>
              <p className="font-body text-sm text-gray-400">
                Check your database connection and Vercel environment variables.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-heading text-3xl text-gray-300 mb-3">No products found</p>
              <p className="font-body text-sm text-gray-400">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      comparePrice: product.comparePrice
                        ? Number(product.comparePrice)
                        : null,
                    }}
                  />
                ))}
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
