"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  comparePrice?: number;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  shippingCost: number;

  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setShipping: (cost: number) => void;

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,
      shippingCost: 0,

      addItem: (item) => {
        set((state) => {
          const key = `${item.productId}-${item.variantId ?? ""}`;
          const existing = state.items.find(
            (i) => `${i.productId}-${i.variantId ?? ""}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}-${i.variantId ?? ""}` === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, id: `${item.productId}-${item.variantId ?? ""}-${Date.now()}` },
            ],
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () =>
        set({ items: [], couponCode: "", couponDiscount: 0, shippingCost: 0 }),

      setCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      setShipping: (cost) => set({ shippingCost: cost }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      total: () => {
        const s = get().subtotal();
        return s - get().couponDiscount + get().shippingCost;
      },
    }),
    { name: "coordset-cart" }
  )
);
