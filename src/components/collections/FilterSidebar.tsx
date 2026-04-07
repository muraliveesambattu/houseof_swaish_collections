"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SIZES, FABRICS, OCCASIONS, COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  onClose?: () => void;
}

const CATEGORIES = [
  { name: "Co-Ord Sets", slug: "co-ord-sets" },
  { name: "Kurti Sets", slug: "kurti-sets" },
  { name: "Dresses", slug: "dresses" },
];

export default function FilterSidebar({ onClose }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string, multi = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (multi) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          const next = existing.filter((v) => v !== value);
          params.delete(key);
          next.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
      onClose?.();
    },
    [searchParams, router, pathname, onClose]
  );

  const isActive = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };

  const clearAll = () => {
    router.push(pathname);
    onClose?.();
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    (k) => k !== "sort" && k !== "page"
  );

  return (
    <div className="space-y-6">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs font-body text-[#BA7517] underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Category
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive("category", cat.slug)}
                onChange={() => updateParam("category", cat.slug, true)}
                className="w-4 h-4 rounded-sm border-gray-300 text-[#C9A6A6] focus:ring-[#C9A6A6]"
              />
              <span className="text-sm font-body text-gray-600 group-hover:text-[#2C2C2A] transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Price Range
        </h3>
        <div className="flex gap-2 items-center">
          <select
            value={searchParams.get("minPrice") ?? ""}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) params.set("minPrice", e.target.value);
              else params.delete("minPrice");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="flex-1 text-xs font-body border border-gray-200 rounded-sm px-2 py-1.5 bg-white focus:outline-none focus:border-[#C9A6A6]"
          >
            <option value="">Min ₹</option>
            {[500, 1000, 1500, 2000, 2500].map((v) => (
              <option key={v} value={v}>₹{v}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">—</span>
          <select
            value={searchParams.get("maxPrice") ?? ""}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) params.set("maxPrice", e.target.value);
              else params.delete("maxPrice");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="flex-1 text-xs font-body border border-gray-200 rounded-sm px-2 py-1.5 bg-white focus:outline-none focus:border-[#C9A6A6]"
          >
            <option value="">Max ₹</option>
            {[1000, 1500, 2000, 3000, 5000].map((v) => (
              <option key={v} value={v}>₹{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => updateParam("size", size, true)}
              className={cn(
                "px-3 py-1.5 text-xs font-body border rounded-sm transition-colors",
                isActive("size", size)
                  ? "bg-[#2C2C2A] text-white border-[#2C2C2A]"
                  : "border-gray-200 text-gray-600 hover:border-[#2C2C2A]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.slice(0, 10).map((color) => (
            <button
              key={color.name}
              onClick={() => updateParam("color", color.name, true)}
              title={color.name}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                isActive("color", color.name)
                  ? "border-[#2C2C2A] scale-110"
                  : "border-gray-200 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
              aria-pressed={isActive("color", color.name)}
            />
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Fabric
        </h3>
        <div className="space-y-2">
          {FABRICS.map((fabric) => (
            <label key={fabric} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive("fabric", fabric)}
                onChange={() => updateParam("fabric", fabric, true)}
                className="w-4 h-4 rounded-sm border-gray-300 text-[#C9A6A6] focus:ring-[#C9A6A6]"
              />
              <span className="text-sm font-body text-gray-600 group-hover:text-[#2C2C2A] transition-colors">
                {fabric}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Occasion */}
      <div>
        <h3 className="font-body font-semibold text-sm text-[#2C2C2A] mb-3 uppercase tracking-wide">
          Occasion
        </h3>
        <div className="space-y-2">
          {OCCASIONS.map((occasion) => (
            <label key={occasion} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive("occasion", occasion)}
                onChange={() => updateParam("occasion", occasion, true)}
                className="w-4 h-4 rounded-sm border-gray-300 text-[#C9A6A6] focus:ring-[#C9A6A6]"
              />
              <span className="text-sm font-body text-gray-600 group-hover:text-[#2C2C2A] transition-colors">
                {occasion}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
