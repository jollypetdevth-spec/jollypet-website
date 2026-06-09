import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import ProductsTableClient from "./ProductsTableClient";

export const metadata: Metadata = { title: "จัดการสินค้า | Admin" };

interface Props {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { search = "", category = "", page = "1" } = await searchParams;
  const pageNum = parseInt(page);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const supabase = createServerSupabaseClient();

  // Build query
  let query = supabase
    .from("products")
    .select(`
      id, name, slug, sku, retail_price, wholesale_price,
      stock_qty, low_stock_alert, is_active, is_featured, created_at,
      categories (name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.ilike("name", `%${search}%`);
  if (category) query = query.eq("category_id", category);

  const [{ data: products, count }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">สินค้าทั้งหมด</h1>
          <p className="text-sm text-gray-500 font-body mt-0.5">{count?.toLocaleString("th-TH") ?? 0} รายการ</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5">
          + เพิ่มสินค้า
        </Link>
      </div>

      {/* Table */}
      <ProductsTableClient
        products={products ?? []}
        categories={categories ?? []}
        totalPages={totalPages}
        currentPage={pageNum}
        searchValue={search}
        categoryValue={category}
      />
    </div>
  );
}
