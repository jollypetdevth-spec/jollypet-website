import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | Jolly Pet" };

async function getStats() {
  const supabase = createServerSupabaseClient();
  const [products, orders, customers] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }).neq("user_type", "admin"),
  ]);
  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    customers: customers.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "สินค้าทั้งหมด", value: stats.products, icon: "📦", href: "/admin/products", color: "bg-blue-50 text-blue-700" },
    { label: "คำสั่งซื้อ", value: stats.orders, icon: "🛒", href: "/admin/orders", color: "bg-green-50 text-green-700" },
    { label: "ลูกค้า", value: stats.customers, icon: "👥", href: "/admin/customers", color: "bg-purple-50 text-purple-700" },
  ];

  const quickActions = [
    { label: "เพิ่มสินค้าใหม่", href: "/admin/products/new", icon: "➕", desc: "เพิ่มสินค้าพร้อมรูปและราคา" },
    { label: "ดูคำสั่งซื้อ", href: "/admin/orders", icon: "📋", desc: "จัดการ orders ที่รอดำเนินการ" },
    { label: "จัดการลูกค้า", href: "/admin/customers", icon: "👤", desc: "อนุมัติบัญชีลูกค้าส่ง" },
  ];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Dashboard</h1>
        <p className="font-body text-gray-500 text-sm mt-1">ภาพรวมระบบ Jolly Pet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-500">{s.label}</p>
                <p className="font-heading font-bold text-3xl text-gray-900 mt-1">{s.value.toLocaleString("th-TH")}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl`}>
                {s.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-heading font-semibold text-lg text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="card p-5 hover:shadow-md transition-shadow hover:border-jolly-navy/20 border border-transparent">
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="font-heading font-semibold text-gray-900 text-sm">{a.label}</p>
              <p className="font-body text-gray-500 text-xs mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
