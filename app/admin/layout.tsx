import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/products", label: "สินค้า", icon: "📦" },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: "🛒" },
  { href: "/admin/customers", label: "ลูกค้า", icon: "👥" },
  { href: "/admin/documents", label: "เอกสาร", icon: "📄" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || (session.user as { userType?: string })?.userType !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-jolly-navy text-white flex-shrink-0 flex flex-col min-h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/" className="font-heading font-bold text-jolly-yellow text-xl">
            Jolly Pet
          </Link>
          <p className="text-white/50 text-xs font-body mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <AdminNavItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-4 border-t border-white/10">
          <Link href="/" className="text-white/60 hover:text-white text-sm font-body transition-colors flex items-center gap-2">
            ← กลับหน้าเว็บ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm font-body text-gray-500">Admin</span>
            <div className="w-8 h-8 rounded-full bg-jolly-navy text-white text-xs flex items-center justify-center font-heading font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Client component for active state would need "use client"
// Using a simple server component approach instead
function AdminNavItem({ href, label, icon, exact }: {
  href: string; label: string; icon: string; exact?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors font-body text-sm"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
