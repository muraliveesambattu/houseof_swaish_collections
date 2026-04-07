"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUiStore } from "@/store/uiStore";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUiStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`
        );
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Handle keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchOpen ? closeSearch() : useUiStore.getState().openSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen, closeSearch]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#FAF7F4] rounded-sm shadow-2xl animate-slide-up">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for co-ord sets, kurtis, dresses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm font-body bg-transparent outline-none text-[#2C2C2A] placeholder-gray-400"
          />
          <button
            onClick={closeSearch}
            className="p-1 text-gray-400 hover:text-[#2C2C2A] transition-colors"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        {query.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-5 py-8 text-center text-sm font-body text-gray-400">
                Searching…
              </div>
            )}
            {!loading && results.length === 0 && (
              <div className="px-5 py-8 text-center text-sm font-body text-gray-400">
                No results found for &quot;{query}&quot;
              </div>
            )}
            {!loading && results.length > 0 && (
              <>
                <div className="divide-y divide-gray-100">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-[#f0ebe6] transition-colors"
                    >
                      <div className="relative w-14 h-16 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                        <Image
                          src={product.images[0] || "/images/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-[#2C2C2A] truncate">
                          {product.name}
                        </p>
                        <p className="text-sm font-body text-[#BA7517] font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={closeSearch}
                  className="flex items-center justify-center gap-2 py-3 text-sm font-body text-[#BA7517] hover:underline border-t border-gray-100"
                >
                  View all results for &quot;{query}&quot;
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
