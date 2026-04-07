"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import Badge from "@/components/ui/Badge";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  fabric?: string | null;
  category?: { name: string };
  variants?: Array<{ size: string; stock: number }>;
}

interface ProductCardProps {
  product: ProductCardData;
  onQuickView?: (product: ProductCardData) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discount = product.comparePrice
    ? getDiscountPercent(product.price, product.comparePrice)
    : 0;

  const sizes =
    product.variants
      ?.filter((v) => v.stock > 0)
      .map((v) => v.size)
      .slice(0, 4) ?? [];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "/images/placeholder.jpg",
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      slug: product.slug,
      quantity: 1,
    });
    openCart();
    setTimeout(() => setAddingToCart(false), 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? "/images/placeholder.jpg",
      price: product.price,
      comparePrice: product.comparePrice ?? undefined,
      slug: product.slug,
    });
  };

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[imgIndex] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() =>
              product.images.length > 1 && setImgIndex(1)
            }
            onMouseLeave={() => setImgIndex(0)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="gold">{discount}% off</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className={cn(
              "w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-colors",
              wishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-400 hover:text-[#2C2C2A] transition-colors"
              aria-label="Quick view"
            >
              <Eye size={14} />
            </button>
          )}
        </div>

        {/* Add to cart (hover) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full py-3 text-xs font-body font-medium tracking-wider uppercase flex items-center justify-center gap-2 transition-colors",
              addingToCart
                ? "bg-[#C9A6A6] text-white"
                : "bg-[#2C2C2A] text-white hover:bg-[#444440]"
            )}
          >
            <ShoppingBag size={14} />
            {addingToCart ? "Added!" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 flex flex-col gap-1 px-1">
        <Link
          href={`/products/${product.slug}`}
          className="font-body text-sm font-medium text-[#2C2C2A] hover:text-[#BA7517] line-clamp-2 transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-semibold text-[#2C2C2A]">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="font-body text-xs text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {sizes.map((size) => (
              <span
                key={size}
                className="text-[10px] font-body px-1.5 py-0.5 border border-gray-200 text-gray-500 rounded-sm"
              >
                {size}
              </span>
            ))}
            {(product.variants?.length ?? 0) > 4 && (
              <span className="text-[10px] font-body text-gray-400">+more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
