"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      slug: item.slug,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-[#2C2C2A] mb-6">
        Wishlist ({items.length})
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-heading text-2xl text-gray-300 mb-2">
            Your wishlist is empty
          </p>
          <p className="font-body text-sm text-gray-400 mb-6">
            Save products you love for later
          </p>
          <Link href="/collections">
            <Button variant="outline">Browse Collections</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.productId} className="group relative">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-gray-100 mb-3">
                <Link href={`/products/${item.slug}`}>
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </Link>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-500"
                  aria-label="Remove from wishlist"
                >
                  <Heart size={14} fill="currentColor" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-3 bg-[#2C2C2A] text-white text-xs font-body font-medium tracking-wider uppercase flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>
                </div>
              </div>
              <Link href={`/products/${item.slug}`}>
                <p className="font-body text-sm font-medium text-[#2C2C2A] hover:text-[#BA7517] line-clamp-2 transition-colors">
                  {item.name}
                </p>
                <p className="font-body text-sm font-semibold text-[#2C2C2A] mt-1">
                  {formatPrice(item.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
