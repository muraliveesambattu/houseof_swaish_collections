"use client";

import { useState } from "react";
import { Heart, Minus, Plus, MessageCircle, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Variant {
  id: string;
  size: string;
  color: string | null;
  stock: number;
}

interface Props {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variants: Variant[];
}

export default function AddToCartSection({ product, variants }: Props) {
  const uniqueSizes = [...new Set(variants.map((v) => v.size))];
  const uniqueColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const selectedVariant = variants.find(
    (v) =>
      v.size === selectedSize &&
      (uniqueColors.length === 0 || v.color === selectedColor)
  );

  const inStock = (selectedVariant?.stock ?? 0) > 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      size: selectedSize,
      color: selectedColor || undefined,
      slug: product.slug,
      quantity: qty,
    });
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to checkout after adding
    window.location.href = "/checkout";
  };

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in: ${product.name} - ${window?.location?.href ?? ""}`
  );

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-body text-sm font-medium text-[#2C2C2A]">
            Size
            {selectedSize && (
              <span className="text-gray-400 ml-2 font-normal">
                — {selectedSize}
              </span>
            )}
          </h3>
          <a
            href="/size-guide"
            className="text-xs font-body text-[#BA7517] underline underline-offset-2"
          >
            Size Guide
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map((size) => {
            const v = variants.find(
              (vt) =>
                vt.size === size &&
                (uniqueColors.length === 0 || vt.color === selectedColor)
            );
            const oos = !v || v.stock === 0;
            return (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                disabled={oos}
                className={cn(
                  "min-w-[2.5rem] px-3 py-2 text-sm font-body border rounded-sm transition-colors relative",
                  selectedSize === size
                    ? "bg-[#2C2C2A] text-white border-[#2C2C2A]"
                    : oos
                    ? "border-gray-100 text-gray-300 cursor-not-allowed line-through"
                    : "border-gray-200 text-gray-700 hover:border-[#2C2C2A]"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
        {sizeError && (
          <p className="text-xs text-red-500 mt-1 font-body">
            Please select a size
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <h3 className="font-body text-sm font-medium text-[#2C2C2A] mb-2">
          Quantity
        </h3>
        <div className="flex items-center border border-gray-200 rounded-sm w-fit">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 py-2 text-sm font-body min-w-[2.5rem] text-center">
            {qty}
          </span>
          <button
            onClick={() =>
              setQty((q) => Math.min(selectedVariant?.stock ?? 10, q + 1))
            }
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          fullWidth
          size="lg"
          variant="primary"
          className="tracking-wider uppercase text-xs"
        >
          {inStock ? "Add to Bag" : "Out of Stock"}
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={!inStock}
          fullWidth
          size="lg"
          variant="outline"
          className="tracking-wider uppercase text-xs"
        >
          Buy Now
        </Button>
      </div>

      {/* Wishlist + WhatsApp + Share */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button
          onClick={() =>
            toggleItem({
              productId: product.id,
              name: product.name,
              image: product.images[0] ?? "",
              price: product.price,
              slug: product.slug,
            })
          }
          className={cn(
            "flex items-center gap-2 text-sm font-body transition-colors",
            wishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          {wishlisted ? "Wishlisted" : "Wishlist"}
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-body text-gray-500 hover:text-green-600 transition-colors"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-body text-gray-500 hover:text-[#BA7517] transition-colors"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}
