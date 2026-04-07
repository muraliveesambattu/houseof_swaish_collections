"use client";

import { useState, useEffect } from "react";

interface VariantRow {
  id: string;
  productName: string;
  size: string;
  color: string | null;
  sku: string | null;
  stock: number;
  editing: boolean;
  draftStock: number;
}

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then((data: Omit<VariantRow, "editing" | "draftStock">[]) =>
        setRows(data.map((v) => ({ ...v, editing: false, draftStock: v.stock })))
      )
      .finally(() => setLoading(false));
  }, []);

  const saveStock = async (id: string, stock: number) => {
    setSaving(id);
    try {
      await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: id, stock }),
      });
      setRows((r) =>
        r.map((row) =>
          row.id === id ? { ...row, stock, editing: false } : row
        )
      );
    } catch {
      alert("Failed to update stock");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C9A6A6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-6">Inventory</h1>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Product</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Size</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Color</th>
                <th className="px-4 py-3 text-gray-400 font-medium">SKU</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Stock</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.stock === 0 ? "bg-red-50" : row.stock <= 5 ? "bg-orange-50" : ""}
                >
                  <td className="px-4 py-3 font-medium text-[#2C2C2A] max-w-[200px] truncate">
                    {row.productName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.size}</td>
                  <td className="px-4 py-3 text-gray-600">{row.color ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{row.sku ?? "—"}</td>
                  <td className="px-4 py-3">
                    {row.editing ? (
                      <input
                        type="number"
                        value={row.draftStock}
                        onChange={(e) =>
                          setRows((r) =>
                            r.map((x) =>
                              x.id === row.id
                                ? { ...x, draftStock: Number(e.target.value) }
                                : x
                            )
                          )
                        }
                        className="w-20 px-2 py-1 text-sm border border-[#C9A6A6] rounded-sm focus:outline-none"
                        min={0}
                      />
                    ) : (
                      <span
                        className={`font-medium ${
                          row.stock === 0
                            ? "text-red-500"
                            : row.stock <= 5
                            ? "text-orange-500"
                            : "text-green-600"
                        }`}
                      >
                        {row.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.editing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveStock(row.id, row.draftStock)}
                          disabled={saving === row.id}
                          className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50"
                        >
                          {saving === row.id ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={() =>
                            setRows((r) =>
                              r.map((x) =>
                                x.id === row.id
                                  ? { ...x, editing: false, draftStock: x.stock }
                                  : x
                              )
                            )
                          }
                          className="text-xs text-gray-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setRows((r) =>
                            r.map((x) =>
                              x.id === row.id ? { ...x, editing: true } : x
                            )
                          )
                        }
                        className="text-xs text-[#BA7517] hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No inventory data.
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
