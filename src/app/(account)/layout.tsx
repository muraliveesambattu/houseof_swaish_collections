import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Package, MapPin, Heart, Settings } from "lucide-react";

const accountLinks = [
  { href: "/account", label: "My Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-8">My Account</h1>
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 flex-shrink-0">
          <div className="flex flex-col gap-1">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-gray-600 hover:text-[#2C2C2A] hover:bg-[#f0ebe6] rounded-sm transition-colors"
              >
                <link.icon size={16} className="flex-shrink-0" />
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/api/auth/signout"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-body text-gray-400 hover:text-red-500 rounded-sm transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
