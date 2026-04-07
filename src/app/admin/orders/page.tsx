import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status as string | undefined;
  const page = Number(params.page ?? 1);
  const pageSize = 20;

  const where = status ? { status: status as never } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]).catch(() => [[], 0] as [never[], number]);

  const statuses = [
    "PENDING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-6">Orders</h1>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <Link
          href="/admin/orders"
          className={`text-xs px-3 py-1.5 rounded-sm font-body font-medium whitespace-nowrap ${
            !status
              ? "bg-[#2C2C2A] text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
          }`}
        >
          All ({total})
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`text-xs px-3 py-1.5 rounded-sm font-body font-medium whitespace-nowrap ${
              status === s
                ? "bg-[#2C2C2A] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Order</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Customer</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Items</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Total</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Payment</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Date</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-[#2C2C2A]">
                    #{order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>
                      <p>{order.user?.name ?? "Guest"}</p>
                      <p className="text-xs text-gray-400">
                        {order.user?.email ?? order.guestEmail ?? "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium text-[#2C2C2A]">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                        ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-[#BA7517] hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > pageSize && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs font-body text-gray-500">
            <span>
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page - 1}`}
                  className="px-3 py-1 border border-gray-200 rounded-sm hover:border-gray-400"
                >
                  Previous
                </Link>
              )}
              {page * pageSize < total && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page + 1}`}
                  className="px-3 py-1 border border-gray-200 rounded-sm hover:border-gray-400"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
