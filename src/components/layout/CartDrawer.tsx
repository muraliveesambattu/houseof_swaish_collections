"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUiStore();
  const { items, updateQuantity, removeItem, subtotal, couponDiscount } = useCartStore();
  const sub = subtotal();
  const remaining = FREE_SHIPPING_THRESHOLD - sub;

  return (
    <Drawer open={cartOpen} onClose={closeCart} side="right" title="Your Bag">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
          <ShoppingBag size={48} className="text-gray-200" />
          <p className="font-heading text-xl text-gray-400">Your bag is empty</p>
          <p className="text-sm font-body text-gray-400">
            Add some beautiful pieces to get started!
          </p>
          <Button onClick={closeCart} variant="outline">
            <Link href="/collections">Browse Collections</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Free shipping progress */}
          <div className="px-6 py-3 bg-[#f0ebe6]">
            {remaining > 0 ? (
              <p className="text-xs font-body text-[#2C2C2A] mb-2">
                Add{" "}
                <span className="font-semibold text-[#BA7517]">
                  {formatPrice(remaining)}
                </span>{" "}
                more for free shipping!
              </p>
            ) : (
              <p className="text-xs font-body text-green-700 font-semibold mb-2">
                🎉 You have free shipping!
              </p>
            )}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#BA7517] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-6">
                <div className="relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-body font-medium text-[#2C2C2A] hover:text-[#BA7517] line-clamp-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <p className="text-xs font-body text-gray-500 mt-0.5">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="text-sm font-body font-semibold text-[#2C2C2A] mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm font-body min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary + CTA */}
          <div className="border-t border-gray-100 px-6 py-4 space-y-4">
            <div className="flex flex-col gap-2 text-sm font-body">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={sub >= FREE_SHIPPING_THRESHOLD ? "text-green-600" : ""}>
                  {sub >= FREE_SHIPPING_THRESHOLD ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base text-[#2C2C2A] pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(sub - couponDiscount)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={closeCart}
              className="text-sm tracking-wider uppercase"
            >
              <Link href="/checkout" className="w-full">
                Proceed to Checkout
              </Link>
            </Button>

            <button
              onClick={closeCart}
              className="w-full text-xs font-body text-gray-400 hover:text-[#2C2C2A] underline underline-offset-2 transition-colors text-center"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
