import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import Badge from "@/components/ui/Badge";

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session) return null;

  const orders = await prisma.order
    .findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div>
      <h2 className="font-heading text-2xl text-[#2C2C2A] mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-heading text-2xl text-gray-300 mb-2">No orders yet</p>
          <p className="font-body text-sm text-gray-400">
            Your orders will appear here once you&apos;ve made a purchase.
          </p>
          <Link
            href="/collections"
            className="mt-4 inline-block text-sm font-body text-[#BA7517] underline"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body font-medium text-sm text-[#2C2C2A]">
                    #{order.orderNumber}
                  </p>
                  <p className="font-body text-xs text-gray-400 mt-0.5">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length !== 1 && "s"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xs font-body font-medium px-2 py-0.5 rounded-sm ${
                      ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <p className="font-body font-semibold text-sm text-[#2C2C2A]">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="text-xs font-body text-gray-500 line-clamp-1">
                      {item.name}
                      {item.size && <span className="text-gray-400"> ({item.size})</span>}
                      × {item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs font-body text-gray-400">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-xs font-body text-[#BA7517] hover:underline flex-shrink-0"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
