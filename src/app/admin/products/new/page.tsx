"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import { FABRICS, OCCASIONS, SIZES } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    fabric: "",
    occasion: "",
    careInstr: "",
    tags: "",
    images: "",
    isFeatured: false,
    isTrending: false,
    isActive: true,
    metaTitle: "",
    metaDesc: "",
  });

  const [variants, setVariants] = useState([
    { size: "M", color: "", stock: 10 },
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
          images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
          tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!productRes.ok) throw new Error("Failed to create product");
      const product = await productRes.json();

      // Create variants
      for (const variant of variants) {
        await fetch(`/api/admin/inventory`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            ...variant,
          }),
        }).catch(() => {});
      }

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-8">New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">Basic Info</h2>
          <Input
            label="Product Name"
            value={form.name}
            onChange={handleNameChange}
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
          />
          <div>
            <label className="text-sm font-medium text-[#2C2C2A] block mb-1">
              Short Description
            </label>
            <textarea
              value={form.shortDesc}
              onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-[#C9A6A6]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2C2C2A] block mb-1">
              Full Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={5}
              required
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-[#C9A6A6]"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <Input
              label="Compare Price (₹) — MRP"
              type="number"
              value={form.comparePrice}
              onChange={(e) =>
                setForm((f) => ({ ...f, comparePrice: e.target.value }))
              }
              helperText="Optional strikethrough price"
            />
          </div>
        </div>

        {/* Category & Details */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">Product Details</h2>
          <div>
            <label className="text-sm font-medium text-[#2C2C2A] block mb-1">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              required
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#2C2C2A] block mb-1">
                Fabric
              </label>
              <select
                value={form.fabric}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fabric: e.target.value }))
                }
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
              >
                <option value="">Select fabric</option>
                {FABRICS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#2C2C2A] block mb-1">
                Occasion
              </label>
              <select
                value={form.occasion}
                onChange={(e) =>
                  setForm((f) => ({ ...f, occasion: e.target.value }))
                }
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
              >
                <option value="">Select occasion</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input
            label="Care Instructions"
            value={form.careInstr}
            onChange={(e) =>
              setForm((f) => ({ ...f, careInstr: e.target.value }))
            }
            placeholder="e.g. Hand wash only"
          />
          <Input
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="e.g. cotton, festive, co-ord"
          />
        </div>

        {/* Images */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <h2 className="font-body font-semibold text-[#2C2C2A] mb-3">
            Images (Cloudinary URLs)
          </h2>
          <textarea
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            rows={4}
            placeholder="One URL per line&#10;https://res.cloudinary.com/..."
            required
            className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-[#C9A6A6] font-mono text-xs"
          />
        </div>

        {/* Variants */}
        <div className="bg-white rounded-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-body font-semibold text-[#2C2C2A]">Variants</h2>
            <button
              type="button"
              onClick={() =>
                setVariants((v) => [...v, { size: "M", color: "", stock: 10 }])
              }
              className="text-xs text-[#BA7517] font-body"
            >
              + Add Variant
            </button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-3 items-center">
                <select
                  value={v.size}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i].size = e.target.value;
                    setVariants(next);
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={v.color}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i].color = e.target.value;
                    setVariants(next);
                  }}
                  placeholder="Color (optional)"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
                />
                <input
                  type="number"
                  value={v.stock}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i].stock = Number(e.target.value);
                    setVariants(next);
                  }}
                  placeholder="Stock"
                  className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
                />
                <button
                  type="button"
                  onClick={() => setVariants((v) => v.filter((_, j) => j !== i))}
                  className="text-red-400 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-sm border border-gray-100 p-5 flex gap-6">
          {[
            { key: "isActive", label: "Active (visible in store)" },
            { key: "isFeatured", label: "Featured" },
            { key: "isTrending", label: "Trending" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#C9A6A6]"
              />
              <span className="text-sm font-body text-[#2C2C2A]">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={saving}>
            Create Product
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
