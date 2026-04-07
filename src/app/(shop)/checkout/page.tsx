"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { usePincode } from "@/hooks/usePincode";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, couponDiscount } = useCartStore();
  const sub = subtotal();
  const shippingCost = sub >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const total = sub - couponDiscount + shippingCost;

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    label: "Home",
  });

  const { data: pincodeData, fetchPincode } = usePincode();

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          const defaultAddr = data.find((a: Address) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        }
      })
      .catch(() => setShowNewForm(true));
  }, []);

  useEffect(() => {
    if (pincodeData) {
      setForm((f) => ({
        ...f,
        city: pincodeData.city,
        state: pincodeData.state,
      }));
    }
  }, [pincodeData]);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, pincode: val }));
    if (/^\d{6}$/.test(val)) fetchPincode(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let addressId = selectedAddressId;

      if (showNewForm || !addressId) {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        addressId = data.id;
      }

      // Store in session for payment step
      sessionStorage.setItem(
        "checkout",
        JSON.stringify({
          addressId,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          subtotal: sub,
          discount: couponDiscount,
          shippingCost,
          total,
        })
      );

      router.push("/checkout/payment");
    } catch {
      alert("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (items.length === 0) {
    router.push("/collections");
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2C2C2A] text-white text-xs font-medium flex items-center justify-center">1</div>
          <span className="text-sm font-body font-medium text-[#2C2C2A]">Address</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 text-xs font-medium flex items-center justify-center">2</div>
          <span className="text-sm font-body text-gray-400">Payment</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Address form */}
        <div className="md:col-span-2">
          <h1 className="font-heading text-2xl text-[#2C2C2A] mb-6">
            Delivery Address
          </h1>

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div className="space-y-3 mb-6">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-[#2C2C2A] bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => {
                      setSelectedAddressId(addr.id);
                      setShowNewForm(false);
                    }}
                    className="mt-1"
                  />
                  <div className="text-sm font-body">
                    <span className="font-medium text-[#2C2C2A]">
                      {addr.label} — {addr.fullName}
                    </span>
                    <p className="text-gray-600 mt-0.5">
                      {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-gray-500">{addr.phone}</p>
                  </div>
                </label>
              ))}
              <button
                onClick={() => {
                  setShowNewForm(true);
                  setSelectedAddressId(null);
                }}
                className="text-sm font-body text-[#BA7517] underline underline-offset-2"
              >
                + Add new address
              </button>
            </div>
          )}

          {(showNewForm || savedAddresses.length === 0) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  required
                />
                <Input
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  type="tel"
                  required
                />
              </div>
              <Input
                label="Pincode"
                value={form.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                required
                helperText="Enter 6-digit pincode to auto-fill city & state"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                />
                <Input
                  label="State"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  required
                />
              </div>
              <Input
                label="Address Line 1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                placeholder="House/Flat No., Street, Area"
                required
              />
              <Input
                label="Address Line 2 (optional)"
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                placeholder="Landmark"
              />

              <Button
                type="submit"
                fullWidth
                isLoading={saving}
                className="mt-2 tracking-wider uppercase text-xs"
              >
                Continue to Payment
              </Button>
            </form>
          )}

          {!showNewForm && selectedAddressId && (
            <Button
              onClick={handleSubmit}
              fullWidth
              isLoading={saving}
              className="mt-4 tracking-wider uppercase text-xs"
            >
              Continue to Payment
            </Button>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">Order Summary</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm font-body">
                <span className="text-gray-700 line-clamp-1 flex-1">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[#2C2C2A] ml-2 flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-2 text-sm font-body">
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
              <span className={shippingCost === 0 ? "text-green-600" : ""}>
                {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base text-[#2C2C2A] pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
