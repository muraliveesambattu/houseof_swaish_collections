import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Archive,
  Tag,
  Image,
  BarChart2,
  Settings,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/inventory", label: "Inventory", icon: Archive },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/content", label: "Content", icon: Image },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#2C2C2A] text-white flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-heading text-lg tracking-wider uppercase">
            TCSS Admin
          </p>
          <p className="font-body text-xs text-gray-400 mt-0.5">
            {session.user.role}
          </p>
        </div>
        <nav className="flex-1 py-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-6 py-2.5 text-sm font-body text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <link.icon size={16} className="flex-shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10">
          <Link
            href="/"
            className="text-xs font-body text-gray-400 hover:text-white transition-colors"
          >
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
