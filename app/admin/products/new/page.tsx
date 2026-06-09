import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "เพิ่มสินค้าใหม่ | Admin" };

export default async function NewProductPage() {
  const supabase = createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order");

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-body">
          ← สินค้าทั้งหมด
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-heading font-bold text-2xl text-gray-900">เพิ่มสินค้าใหม่</h1>
      </div>

      <ProductForm
        categories={categories ?? []}
        mode="create"
      />
    </div>
  );
}
