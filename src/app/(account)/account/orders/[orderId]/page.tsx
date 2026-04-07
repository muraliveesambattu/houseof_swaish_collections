import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import Link from "next/link";
import Breadcrumb from "@/components/shared/Breadcrumb";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const session = await auth();
  if (!session) notFound();

  const order = await prisma.order
    .findUnique({
      where: { id: orderId, userId: session.user.id },
      include: { items: true, shippingAddress: true, coupon: true },
    })
    .catch(() => null);

  if (!order) notFound();

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIdx = statuses.indexOf(order.status);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "My Orders", href: "/account/orders" },
          { label: `#${order.orderNumber}` },
        ]}
        className="mb-6"
      />

      <div className="flex items-start justify-between mb-6">
        <h2 className="font-heading text-2xl text-[#2C2C2A]">
          Order #{order.orderNumber}
        </h2>
        <span
          className={`text-xs font-body font-medium px-2.5 py-1 rounded-sm ${
            ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100"
          }`}
        >
          {ORDER_STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Status timeline */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {statuses.slice(0, 5).map((status, i) => (
          <div key={status} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  i <= currentIdx
                    ? "bg-[#2C2C2A] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i < currentIdx ? "✓" : i + 1}
              </div>
              <span className="text-[10px] font-body text-gray-500 whitespace-nowrap">
                {ORDER_STATUS_LABELS[status]}
              </span>
            </div>
            {i < 4 && (
              <div
                className={`flex-1 h-0.5 mx-2 min-w-[2rem] ${
                  i < currentIdx ? "bg-[#2C2C2A]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-sm p-5 mb-4">
        <h3 className="font-body font-medium text-sm text-[#2C2C2A] mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm font-body">
              <div>
                <p className="text-[#2C2C2A] font-medium">{item.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {item.size && `Size: ${item.size}`}
                  {item.color && ` · ${item.color}`}
                  {` · Qty: ${item.quantity}`}
                </p>
              </div>
              <span className="text-[#2C2C2A] font-medium ml-4">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm font-body">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{Number(order.shippingCost) === 0 ? "Free" : formatPrice(Number(order.shippingCost))}</span>
          </div>
          <div className="flex justify-between font-semibold text-[#2C2C2A] text-base pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {order.shippingAddress && (
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h3 className="font-body font-medium text-sm text-[#2C2C2A] mb-3">Delivery Address</h3>
          <p className="text-sm font-body text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
            {order.shippingAddress.phone}
          </p>
        </div>
      )}

      {order.trackingNumber && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-sm p-4">
          <p className="text-sm font-body text-blue-700">
            <strong>Tracking:</strong> {order.trackingNumber}
            {order.shippingCarrier && ` · ${order.shippingCarrier}`}
          </p>
        </div>
      )}
    </div>
  );
}
