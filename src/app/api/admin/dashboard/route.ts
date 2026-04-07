import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      todayRevenue,
      totalOrders,
      totalCustomers,
      lowStockVariants,
      recentOrders,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: today }, paymentStatus: "PAID" },
      }),
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
          items: true,
          user: { select: { name: true, email: true } },
        },
      }),
      // Last 30 days revenue by day
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, SUM(total) as revenue
        FROM "Order"
        WHERE payment_status = 'PAID'
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `.catch(() => []),
    ]);

    return NextResponse.json({
      todayOrders,
      todayRevenue: Number(todayRevenue._sum.total ?? 0),
      totalOrders,
      totalCustomers,
      lowStockAlerts: lowStockVariants,
      recentOrders,
      monthlyRevenue,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
