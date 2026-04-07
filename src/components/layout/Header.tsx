"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Heart, Search, Menu, User } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { openCart, openSearch, toggleMobileMenu } = useUiStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-[#FAF7F4] transition-shadow duration-200",
        scrolled && "shadow-sm"
      )}
    >
      {/* Announcement bar */}
      <div className="bg-[#2C2C2A] text-[#FAF7F4] text-xs py-2 text-center font-body tracking-wide">
        Free shipping on orders above ₹999 | Use code{" "}
        <span className="text-[#C9A6A6] font-semibold">FIRST10</span> for 10% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 items-center h-16 md:h-20">
          {/* Left — hamburger (mobile) + nav (desktop) */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-[#2C2C2A]"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-body text-[#2C2C2A] hover:text-[#BA7517] tracking-wide transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center — logo */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center"
          >
            <span className="font-heading text-base md:text-xl tracking-[0.12em] text-[#2C2C2A] uppercase text-center leading-tight">
              houseof swaishq
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              collections
            </span>
            <span className="block w-full h-px bg-[#BA7517] mt-0.5" />
          </Link>

          {/* Right — icons */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            <button
              onClick={openSearch}
              className="p-2 text-[#2C2C2A] hover:text-[#BA7517] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link
              href="/account/wishlist"
              className="relative p-2 text-[#2C2C2A] hover:text-[#BA7517] transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-[#C9A6A6] text-[#2C2C2A] text-[10px] font-medium flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden md:flex p-2 text-[#2C2C2A] hover:text-[#BA7517] transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-[#2C2C2A] hover:text-[#BA7517] transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-[#2C2C2A] text-white text-[10px] font-medium flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>{/* end grid */}
      </div>
    </header>
  );
}
