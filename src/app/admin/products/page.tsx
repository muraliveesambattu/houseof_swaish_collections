import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product
    .findMany({
      include: {
        category: { select: { name: true } },
        variants: { select: { stock: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-[#2C2C2A]">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm" className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Product</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Category</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Price</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Stock</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (s, v) => s + v.stock,
                  0
                );
                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#2C2C2A] truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-xs">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#2C2C2A]">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          totalStock === 0
                            ? "text-red-500"
                            : totalStock <= 5
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {totalStock === 0 ? "Out of stock" : `${totalStock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs text-[#BA7517] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No products yet.{" "}
                    <Link
                      href="/admin/products/new"
                      className="text-[#BA7517] underline"
                    >
                      Add your first product →
                    </Link>
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
