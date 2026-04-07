import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/collections/ProductCard";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: Awaited<ReturnType<typeof fetchProducts>> = [];
  if (query.length >= 2) {
    products = await fetchProducts(query);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-[#FAF7F4]">
      {/* Search bar */}
      <div className="max-w-xl mx-auto mb-10">
        <form method="GET" action="/search" className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search for co-ord sets, kurtis, dresses…"
            autoFocus
            className="w-full pl-11 pr-4 py-4 text-sm font-body bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
          />
        </form>
      </div>

      {query.length >= 2 ? (
        <>
          <p className="font-body text-sm text-gray-500 mb-6">
            {products.length === 0
              ? `No results for "${query}"`
              : `${products.length} result${products.length !== 1 ? "s" : ""} for "${query}"`}
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={{ ...product, price: Number(product.price), comparePrice: product.comparePrice ? Number(product.comparePrice) : null }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="font-heading text-2xl text-gray-300 mb-2">No results found</p>
              <p className="font-body text-sm text-gray-400">
                Try a different keyword or browse our{" "}
                <a href="/collections" className="text-[#BA7517] underline">
                  collections
                </a>
                .
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="font-body text-gray-400">
            Enter at least 2 characters to search.
          </p>
        </div>
      )}
    </div>
  );
}

async function fetchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query.toLowerCase() } },
        { fabric: { contains: query, mode: "insensitive" } },
        { occasion: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      comparePrice: true,
      images: true,
      variants: { select: { size: true, color: true, colorHex: true, stock: true } },
    },
    take: 40,
    orderBy: { createdAt: "desc" },
  });
}
