import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const pageSize = 25;

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]).catch(() => [[], 0] as [never[], number]);

  return (
    <div>
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-6">
        Customers ({total})
      </h1>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Name</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Email</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Phone</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Orders</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-[#2C2C2A]">
                    {c.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{c._count.orders}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No customers yet.
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
