"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { NAV_LINKS } from "@/lib/constants";
import Drawer from "@/components/ui/Drawer";

export default function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu } = useUiStore();

  return (
    <Drawer
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      side="left"
      title="Menu"
    >
      <nav className="flex flex-col py-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileMenu}
            className="flex items-center justify-between px-6 py-4 text-base font-body text-[#2C2C2A] hover:bg-[#f0ebe6] hover:text-[#BA7517] border-b border-gray-100 transition-colors"
          >
            {link.label}
            <ChevronRight size={16} className="text-gray-400" />
          </Link>
        ))}
        <div className="px-6 pt-6 pb-4 border-t border-gray-100 mt-4">
          <Link
            href="/account"
            onClick={closeMobileMenu}
            className="block text-sm font-body text-gray-600 hover:text-[#BA7517] mb-3 transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/account/orders"
            onClick={closeMobileMenu}
            className="block text-sm font-body text-gray-600 hover:text-[#BA7517] mb-3 transition-colors"
          >
            My Orders
          </Link>
          <Link
            href="/account/wishlist"
            onClick={closeMobileMenu}
            className="block text-sm font-body text-gray-600 hover:text-[#BA7517] transition-colors"
          >
            Wishlist
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}
