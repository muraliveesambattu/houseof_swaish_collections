import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

async function getDashboardData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayRevenue, totalOrders, totalCustomers, lowStock, recentOrders] =
      await Promise.all([
        prisma.order.aggregate({
          where: { createdAt: { gte: today }, paymentStatus: "PAID" },
          _sum: { total: true },
        }),
        prisma.order.count({ where: { paymentStatus: "PAID" } }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            items: true,
          },
        }),
      ]);

    return {
      todayRevenue: Number(todayRevenue._sum.total ?? 0),
      totalOrders,
      totalCustomers,
      lowStock,
      recentOrders,
    };
  } catch {
    return {
      todayRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      lowStock: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { label: "Today's Revenue", value: formatPrice(data.todayRevenue), color: "bg-[#BA7517]" },
    { label: "Total Orders", value: data.totalOrders.toString(), color: "bg-[#2C2C2A]" },
    { label: "Customers", value: data.totalCustomers.toString(), color: "bg-[#C9A6A6]" },
    { label: "Low Stock Alerts", value: data.lowStock.toString(), color: "bg-red-500" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-sm border border-gray-100 p-5"
          >
            <p className="font-body text-xs text-gray-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="font-heading text-3xl text-[#2C2C2A]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-sm border border-gray-100 p-5">
        <h2 className="font-heading text-xl text-[#2C2C2A] mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 text-gray-400 font-medium">Order</th>
                <th className="pb-3 text-gray-400 font-medium">Customer</th>
                <th className="pb-3 text-gray-400 font-medium">Amount</th>
                <th className="pb-3 text-gray-400 font-medium">Status</th>
                <th className="pb-3 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 font-medium text-[#2C2C2A]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3 text-gray-600">
                    {order.user?.name ?? order.guestEmail ?? "Guest"}
                  </td>
                  <td className="py-3 font-medium text-[#2C2C2A]">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                        ORDER_STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
