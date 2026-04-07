import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AdminRevenueChart from "@/components/admin/AdminRevenueChart";

async function getAnalyticsData() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentOrders, topProducts, ordersByStatus] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: "PAID", createdAt: { gte: thirtyDaysAgo } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.orderItem.groupBy({
        by: ["productId", "name"],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    // Aggregate by day
    const dailyMap = new Map<string, number>();
    for (const order of recentOrders) {
      const day = order.createdAt.toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + Number(order.total));
    }
    const chartData = Array.from(dailyMap.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    const totalRevenue = recentOrders.reduce((s, o) => s + Number(o.total), 0);

    return { chartData, topProducts, ordersByStatus, totalRevenue };
  } catch {
    return { chartData: [], topProducts: [], ordersByStatus: [], totalRevenue: 0 };
  }
}

export default async function AdminAnalyticsPage() {
  const { chartData, topProducts, ordersByStatus, totalRevenue } = await getAnalyticsData();

  return (
    <div>
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-6">Analytics</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <p className="font-body text-xs text-gray-400 uppercase tracking-wide mb-1">
            Revenue (30 days)
          </p>
          <p className="font-heading text-3xl text-[#2C2C2A]">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <p className="font-body text-xs text-gray-400 uppercase tracking-wide mb-1">
            Orders (30 days)
          </p>
          <p className="font-heading text-3xl text-[#2C2C2A]">
            {ordersByStatus.reduce((s, o) => s + o._count.id, 0)}
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-sm border border-gray-100 p-5 mb-6">
        <h2 className="font-body font-semibold text-[#2C2C2A] mb-4">
          Daily Revenue — Last 30 Days
        </h2>
        <AdminRevenueChart data={chartData} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h2 className="font-body font-semibold text-[#2C2C2A] mb-4">
            Top Selling Products
          </h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.productId ?? i} className="flex items-center justify-between text-sm font-body">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-gray-400 font-medium w-5">{i + 1}.</span>
                  <span className="text-[#2C2C2A] truncate">{p.name}</span>
                </div>
                <span className="text-gray-500 flex-shrink-0 ml-2">
                  {p._sum.quantity ?? 0} sold
                </span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
          </div>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h2 className="font-body font-semibold text-[#2C2C2A] mb-4">
            Orders by Status
          </h2>
          <div className="space-y-3">
            {ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm font-body">
                <span className="text-gray-600">{s.status}</span>
                <span className="font-medium text-[#2C2C2A]">{s._count.id}</span>
              </div>
            ))}
            {ordersByStatus.length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
