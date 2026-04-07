"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [checkoutData, setCheckoutData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");

  useEffect(() => {
    const data = sessionStorage.getItem("checkout");
    if (!data) {
      router.push("/checkout");
      return;
    }
    setCheckoutData(JSON.parse(data));
  }, [router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;
    setLoading(true);

    try {
      // Create order
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checkoutData, paymentMethod }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error);

      if (paymentMethod === "COD") {
        clearCart();
        sessionStorage.removeItem("checkout");
        router.push(`/order-confirmation/${orderData.orderId}`);
        return;
      }

      // Open Razorpay
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Math.round(Number(checkoutData.total) * 100),
        currency: "INR",
        name: "The Co-Ord Set Studio",
        description: "Fashion Order",
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          // Verify payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.orderId,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            sessionStorage.removeItem("checkout");
            router.push(`/order-confirmation/${orderData.orderId}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#C9A6A6" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  if (!checkoutData) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-500 text-white text-xs font-medium flex items-center justify-center">✓</div>
          <span className="text-sm font-body text-gray-400">Address</span>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2C2C2A] text-white text-xs font-medium flex items-center justify-center">2</div>
          <span className="text-sm font-body font-medium text-[#2C2C2A]">Payment</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Payment options */}
        <div className="md:col-span-2">
          <h1 className="font-heading text-2xl text-[#2C2C2A] mb-6">
            Payment Method
          </h1>

          <div className="space-y-3 mb-8">
            <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === "RAZORPAY" ? "border-[#2C2C2A] bg-gray-50" : "border-gray-200"}`}>
              <input
                type="radio"
                value="RAZORPAY"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              <div className="flex-1">
                <p className="font-body font-medium text-sm text-[#2C2C2A]">
                  Pay Online
                </p>
                <p className="font-body text-xs text-gray-500">
                  UPI, Net Banking, Credit/Debit Cards, EMI via Razorpay
                </p>
              </div>
              <div className="flex gap-1.5">
                {["UPI", "Card", "EMI"].map((m) => (
                  <span key={m} className="text-[10px] font-body px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                    {m}
                  </span>
                ))}
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === "COD" ? "border-[#2C2C2A] bg-gray-50" : "border-gray-200"}`}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <div>
                <p className="font-body font-medium text-sm text-[#2C2C2A]">
                  Cash on Delivery
                </p>
                <p className="font-body text-xs text-gray-500">
                  Pay when your order arrives
                </p>
              </div>
            </label>
          </div>

          <Button
            onClick={handlePlaceOrder}
            fullWidth
            size="lg"
            isLoading={loading}
            className="tracking-wider uppercase text-xs"
          >
            {paymentMethod === "COD"
              ? "Place Order"
              : `Pay ${formatPrice(Number(checkoutData.total))}`}
          </Button>

          <p className="text-xs text-gray-400 font-body text-center mt-3">
            By placing this order, you agree to our Terms & Conditions and Privacy Policy.
          </p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm font-body">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(Number(checkoutData.subtotal))}</span>
            </div>
            {Number(checkoutData.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(Number(checkoutData.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={Number(checkoutData.shippingCost) === 0 ? "text-green-600" : ""}>
                {Number(checkoutData.shippingCost) === 0
                  ? "Free"
                  : formatPrice(Number(checkoutData.shippingCost))}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base text-[#2C2C2A] pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span>{formatPrice(Number(checkoutData.total))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
