"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minOrderValue: number | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
}

const EMPTY_FORM = {
  code: "",
  type: "PERCENTAGE" as "PERCENTAGE" | "FIXED" | "FREE_SHIPPING",
  value: "",
  minOrderValue: "",
  usageLimit: "",
  perUserLimit: "",
  validUntil: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then(setCoupons)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : undefined,
          validUntil: form.validUntil || undefined,
        }),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch {
      alert("Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setCoupons((c) => c.map((x) => (x.id === id ? { ...x, isActive: !isActive } : x)));
  };

  const typeLabel = (type: string) => {
    if (type === "PERCENTAGE") return "%";
    if (type === "FIXED") return "₹ off";
    return "Free Ship";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-[#2C2C2A]">Coupons</h1>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Coupon"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-sm border border-gray-100 p-5 mb-6 space-y-4"
        >
          <h2 className="font-body font-semibold text-[#2C2C2A]">Create Coupon</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. SAVE10"
              required
            />
            <div>
              <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label={form.type === "PERCENTAGE" ? "Discount %" : "Discount ₹"}
              type="number"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              required={form.type !== "FREE_SHIPPING"}
              disabled={form.type === "FREE_SHIPPING"}
            />
            <Input
              label="Min Order (₹)"
              type="number"
              value={form.minOrderValue}
              onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))}
              helperText="Optional"
            />
            <Input
              label="Valid Until"
              type="date"
              value={form.validUntil}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Total Usage Limit"
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
              helperText="Optional"
            />
            <Input
              label="Per User Limit"
              type="number"
              value={form.perUserLimit}
              onChange={(e) => setForm((f) => ({ ...f, perUserLimit: e.target.value }))}
              helperText="Optional"
            />
          </div>
          <Button type="submit" isLoading={saving}>
            Create Coupon
          </Button>
        </form>
      )}

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">Code</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Discount</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Min Order</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Used</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Expires</th>
                <th className="px-4 py-3 text-gray-400 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-mono font-medium text-[#2C2C2A]">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.type === "FREE_SHIPPING"
                        ? "Free Shipping"
                        : c.type === "PERCENTAGE"
                        ? `${c.value}% off`
                        : `₹${c.value} off`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.minOrderValue ? `₹${c.minOrderValue}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {c.usageCount}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {c.validUntil ? formatDate(new Date(c.validUntil)) : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c.id, c.isActive)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                          c.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
