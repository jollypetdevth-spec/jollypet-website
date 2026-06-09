"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  retail_price: number;
  wholesale_price: number | null;
  stock_qty: number;
  low_stock_alert: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  categories: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  products: Product[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
  searchValue: string;
  categoryValue: string;
}

export default function ProductsTableClient({
  products,
  categories,
  totalPages,
  currentPage,
  searchValue,
  categoryValue,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchValue);
  const [category, setCategory] = useState(categoryValue);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function applyFilter() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") applyFilter();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`ยืนยันลบสินค้า "${name}"?\n\nการลบนี้ไม่สามารถย้อนกลับได้`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      startTransition(() => router.refresh());
    } else {
      alert("ลบไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="text"
          className="input max-w-xs"
          placeholder="ค้นหาชื่อสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select className="input max-w-[180px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={applyFilter} className="btn-primary px-5" disabled={isPending}>
          {isPending ? "..." : "ค้นหา"}
        </button>
        {(searchValue || categoryValue) && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              router.push(pathname);
            }}
            className="btn-outline px-4 text-sm"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-heading font-semibold text-gray-700">สินค้า</th>
              <th className="text-left px-4 py-3 font-heading font-semibold text-gray-700">หมวดหมู่</th>
              <th className="text-right px-4 py-3 font-heading font-semibold text-gray-700">ราคาปลีก</th>
              <th className="text-right px-4 py-3 font-heading font-semibold text-gray-700">ราคาส่ง</th>
              <th className="text-right px-4 py-3 font-heading font-semibold text-gray-700">สต็อก</th>
              <th className="text-center px-4 py-3 font-heading font-semibold text-gray-700">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  ไม่พบสินค้า
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLowStock = p.stock_qty > 0 && p.stock_qty <= p.low_stock_alert;
                const isOutOfStock = p.stock_qty === 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      {p.sku && <div className="text-xs text-gray-400 mt-0.5">{p.sku}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.categories?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-medium">฿{p.retail_price.toLocaleString("th-TH")}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {p.wholesale_price ? `฿${p.wholesale_price.toLocaleString("th-TH")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-gray-900"}`}>
                        {p.stock_qty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.is_active ? "แสดง" : "ซ่อน"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === p.id ? "..." : "ลบ"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchValue) params.set("search", searchValue);
            if (categoryValue) params.set("category", categoryValue);
            params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`${pathname}?${params.toString()}`}
                className={`w-8 h-8 rounded-lg text-sm font-heading font-medium flex items-center justify-center transition-colors ${
                  p === currentPage
                    ? "bg-jolly-navy text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
