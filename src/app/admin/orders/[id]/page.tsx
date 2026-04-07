"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  trackingNumber: string | null;
  shippingCarrier: string | null;
  notes: string | null;
  createdAt: string;
  user: { name: string; email: string; phone: string } | null;
  guestEmail: string | null;
  guestPhone: string | null;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  } | null;
  items: {
    id: string;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
    size: string | null;
    color: string | null;
  }[];
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
        setTracking(data.trackingNumber ?? "");
        setCarrier(data.shippingCarrier ?? "");
      })
      .catch(() => router.push("/admin/orders"));
  }, [id, router]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber: tracking, shippingCarrier: carrier }),
      });
      setOrder((o) => o ? { ...o, status, trackingNumber: tracking, shippingCarrier: carrier } : o);
    } catch {
      alert("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C9A6A6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const addr = order.shippingAddress;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-sm font-body text-gray-400 hover:text-[#2C2C2A]"
        >
          ← Orders
        </button>
        <h1 className="font-heading text-3xl text-[#2C2C2A]">
          #{order.orderNumber}
        </h1>
        <span
          className={`text-xs px-2 py-1 rounded-sm font-body font-medium ${
            ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: items + actions */}
        <div className="col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-sm border border-gray-100 p-5">
            <h2 className="font-body font-semibold text-[#2C2C2A] mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-[#2C2C2A] truncate">{item.name}</p>
                    <p className="font-body text-xs text-gray-400">
                      {[item.size, item.color].filter(Boolean).join(" / ")} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-body text-sm font-medium text-[#2C2C2A]">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
              <div className="flex justify-between text-sm font-body text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm font-body text-green-600">
                  <span>Discount</span>
                  <span>−{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-body text-gray-600">
                <span>Shipping</span>
                <span>{Number(order.shippingCost) === 0 ? "FREE" : formatPrice(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between text-base font-body font-semibold text-[#2C2C2A] pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
            <h2 className="font-body font-semibold text-[#2C2C2A]">Update Order</h2>
            <div>
              <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Tracking Number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. BD123456789IN"
            />
            <Input
              label="Shipping Carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g. Delhivery, Bluedart"
            />
            <Button onClick={handleUpdate} isLoading={saving}>
              Update Order
            </Button>
          </div>
        </div>

        {/* Right: customer + address */}
        <div className="space-y-6">
          <div className="bg-white rounded-sm border border-gray-100 p-5">
            <h2 className="font-body font-semibold text-[#2C2C2A] mb-3">Customer</h2>
            <div className="space-y-1 text-sm font-body text-gray-600">
              <p className="font-medium text-[#2C2C2A]">
                {order.user?.name ?? "Guest"}
              </p>
              <p>{order.user?.email ?? order.guestEmail ?? "—"}</p>
              <p>{order.user?.phone ?? order.guestPhone ?? "—"}</p>
            </div>
          </div>

          {addr && (
            <div className="bg-white rounded-sm border border-gray-100 p-5">
              <h2 className="font-body font-semibold text-[#2C2C2A] mb-3">Ship to</h2>
              <div className="text-sm font-body text-gray-600 space-y-0.5">
                <p className="font-medium text-[#2C2C2A]">{addr.name}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                <p>{addr.phone}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-sm border border-gray-100 p-5">
            <h2 className="font-body font-semibold text-[#2C2C2A] mb-3">Payment</h2>
            <div className="text-sm font-body space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ordered</span>
                <span className="text-[#2C2C2A]">{formatDate(new Date(order.createdAt))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
