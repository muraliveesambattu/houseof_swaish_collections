import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, getDeliveryDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;

  const order = await prisma.order
    .findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
      },
    })
    .catch(() => null);

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="font-heading text-2xl text-gray-400">Order not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={64} className="text-green-500" />
      </div>

      <h1 className="font-heading text-4xl text-[#2C2C2A] mb-3">
        Order Confirmed!
      </h1>
      <p className="font-body text-gray-500 text-sm mb-1">
        Order #{order.orderNumber}
      </p>
      <p className="font-body text-gray-500 text-sm mb-8">
        Placed on {formatDate(order.createdAt)}
      </p>

      <div className="bg-[#FAF7F4] border border-gray-100 rounded-sm p-6 text-left mb-6">
        <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">
          What&apos;s Next?
        </h2>
        <div className="space-y-3 text-sm font-body text-gray-600">
          <p>📧 A confirmation email has been sent to you.</p>
          <p>📦 Expected delivery: <strong>{getDeliveryDate(7)}</strong></p>
          <p>🚚 We&apos;ll send you tracking details once your order is shipped.</p>
        </div>
      </div>

      {/* Order items */}
      <div className="text-left mb-6">
        <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm font-body text-gray-600">
              <span>
                {item.name}
                {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                <span className="text-gray-400 ml-1">× {item.quantity}</span>
              </span>
              <span className="font-medium text-[#2C2C2A]">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-body font-semibold text-[#2C2C2A]">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="text-left mb-8">
          <h2 className="font-heading text-xl text-[#2C2C2A] mb-2">Deliver to</h2>
          <p className="text-sm font-body text-gray-600">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="outline">Track My Order</Button>
        </Link>
        <Link href="/collections">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
