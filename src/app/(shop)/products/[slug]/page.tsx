import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Suspense } from "react";
import ImageGallery from "@/components/product/ImageGallery";
import AddToCartSection from "@/components/product/AddToCartSection";
import Breadcrumb from "@/components/shared/Breadcrumb";
import PriceDisplay from "@/components/shared/PriceDisplay";
import StarRating from "@/components/shared/StarRating";
import Accordion from "@/components/ui/Accordion";
import ProductCard from "@/components/collections/ProductCard";
import SectionHeading from "@/components/shared/SectionHeading";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product
    .findUnique({ where: { slug } })
    .catch(() => null);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDesc ?? product.shortDesc ?? product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product
    .findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })
    .catch(() => null);

  if (!product) notFound();

  // Related products
  const related = await prisma.product
    .findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        NOT: { id: product.id },
      },
      include: {
        category: { select: { name: true } },
        variants: { select: { size: true, stock: true } },
      },
      take: 4,
    })
    .catch(() => []);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  const accordionItems = [
    {
      title: "Product Description",
      content: <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />,
    },
    {
      title: "Fabric & Care",
      content: (
        <div className="space-y-2">
          {product.fabric && <p><strong>Fabric:</strong> {product.fabric}</p>}
          {product.careInstr && <p><strong>Care:</strong> {product.careInstr}</p>}
        </div>
      ),
    },
    {
      title: "Size & Fit",
      content: (
        <div className="space-y-2">
          {product.modelHeight && <p><strong>Model Height:</strong> {product.modelHeight}</p>}
          {product.modelWears && <p><strong>Model Wears:</strong> {product.modelWears}</p>}
          <a href="/size-guide" className="text-[#BA7517] underline text-sm">View full size guide →</a>
        </div>
      ),
    },
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-2">
          <p>Free shipping on orders above ₹999. Standard delivery in 5–7 business days.</p>
          <p>Easy 7-day returns. Please see our <a href="/return-policy" className="text-[#BA7517] underline">return policy</a> for details.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: product.category.name, href: `/collections/${product.category.slug}` },
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <ImageGallery images={product.images} name={product.name} />

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#BA7517] mb-1">
              {product.category.name}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl text-[#2C2C2A] leading-tight">
              {product.name}
            </h1>
          </div>

          <PriceDisplay
            price={Number(product.price)}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
            size="lg"
            showBadge
          />

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} showCount count={product.reviews.length} />
            </div>
          )}

          {product.shortDesc && (
            <p className="font-body text-sm text-gray-600 leading-relaxed">
              {product.shortDesc}
            </p>
          )}

          <div className="h-px bg-gray-100" />

          <AddToCartSection
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              images: product.images,
            }}
            variants={product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              stock: v.stock,
            }))}
          />

          {/* Fabric details */}
          {(product.fabric || product.occasion) && (
            <div className="bg-[#f5f0eb] rounded-sm p-4 space-y-1">
              {product.fabric && (
                <p className="text-sm font-body">
                  <span className="font-medium text-[#2C2C2A]">Fabric: </span>
                  <span className="text-gray-600">{product.fabric}</span>
                </p>
              )}
              {product.occasion && (
                <p className="text-sm font-body">
                  <span className="font-medium text-[#2C2C2A]">Occasion: </span>
                  <span className="text-gray-600">{product.occasion}</span>
                </p>
              )}
            </div>
          )}

          <Accordion items={accordionItems} />
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="font-heading text-2xl text-[#2C2C2A] mb-6">
            Customer Reviews
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-sm p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A6A6] flex items-center justify-center text-white text-xs font-medium">
                    {review.user.name?.[0] ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-[#2C2C2A]">
                      {review.user.name ?? "Anonymous"}
                    </p>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                </div>
                {review.title && (
                  <p className="font-body font-medium text-sm text-[#2C2C2A] mb-1">
                    {review.title}
                  </p>
                )}
                {review.body && (
                  <p className="text-sm font-body text-gray-600">{review.body}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="You May Also Like" className="mb-8" />
          <Suspense fallback={null}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    ...p,
                    price: Number(p.price),
                    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
                  }}
                />
              ))}
            </div>
          </Suspense>
        </section>
      )}
    </div>
  );
}
