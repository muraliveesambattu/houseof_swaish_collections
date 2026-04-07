"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  image: string;
  isActive: boolean;
  position: string;
  sortOrder: number;
}

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
  image: "",
  position: "HERO",
  isActive: true,
};

export default function AdminContentPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/banners")
      .then((r) => r.json())
      .then(setBanners)
      .catch(() => {});
  };

  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch {
      alert("Failed to create banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    }).catch(() => {});
    setBanners((b) =>
      b.map((x) => (x.id === id ? { ...x, isActive: !isActive } : x))
    );
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" }).catch(() => {});
    setBanners((b) => b.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-[#2C2C2A]">Content</h1>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Banner"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-sm border border-gray-100 p-5 mb-6 space-y-4"
        >
          <h2 className="font-body font-semibold text-[#2C2C2A]">New Banner</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <div>
              <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Position</label>
              <select
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6]"
              >
                <option value="HERO">Hero Slider</option>
                <option value="PROMO">Promo Bar</option>
                <option value="CATEGORY">Category Banner</option>
              </select>
            </div>
          </div>
          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
          <Input
            label="Image URL (Cloudinary)"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CTA Text"
              value={form.ctaText}
              onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
              placeholder="e.g. Shop Now"
            />
            <Input
              label="CTA Link"
              value={form.ctaLink}
              onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
              placeholder="/collections"
            />
          </div>
          <Button type="submit" isLoading={saving}>
            Create Banner
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {banners.length === 0 && (
          <div className="bg-white rounded-sm border border-gray-100 p-12 text-center text-gray-400 font-body text-sm">
            No banners yet. Add your first banner above.
          </div>
        )}
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-sm border border-gray-100 p-4 flex items-center gap-4"
          >
            <div className="w-20 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-medium text-[#2C2C2A] truncate">{b.title}</p>
              <p className="font-body text-xs text-gray-400">
                {b.position} · {b.ctaLink ?? "no link"}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleActive(b.id, b.isActive)}
                className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                  b.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {b.isActive ? "Active" : "Hidden"}
              </button>
              <button
                onClick={() => deleteBanner(b.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
