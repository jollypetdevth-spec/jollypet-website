import { createServerSupabaseClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("products").select("name").eq("id", id).single<{ name: string }>();
  return { title: `แก้ไข: ${data?.name ?? "สินค้า"} | Admin` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const [productRes, { data: categories }] = await Promise.all([
    sb
      .from("products")
      .select(`*, product_images (id, url, is_primary, sort_order), product_variants (id, name, sku, barcode, retail_price, wholesale_price, stock_qty, image_url, sort_order, is_active)`)
      .eq("id", id)
      .single() as Promise<{
        data: {
          id: string; category_id: string | null; name: string; slug: string;
          sku: string | null; barcode: string | null;
          short_description: string | null; description: string | null;
          retail_price: number; wholesale_price: number | null;
          cost_price: number | null; weight_grams: number | null;
          stock_qty: number; low_stock_alert: number;
          is_active: boolean; is_featured: boolean;
          meta_title: string | null; meta_description: string | null;
          product_images: { id: string; url: string; is_primary: boolean; sort_order: number }[];
          product_variants: { id: string; name: string; sku: string | null; barcode: string | null; retail_price: number | null; wholesale_price: number | null; stock_qty: number; image_url: string | null; sort_order: number; is_active: boolean }[];
        } | null;
        error: unknown;
      }>,
    supabase.from("categories").select("id, name, slug").order("sort_order"),
  ]);

  const product = productRes.data;
  if (!product) notFound();

  const initialData = {
    id: product.id,
    category_id: product.category_id ?? "",
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    short_description: product.short_description ?? "",
    description: product.description ?? "",
    retail_price: String(product.retail_price),
    wholesale_price: product.wholesale_price ? String(product.wholesale_price) : "",
    cost_price: product.cost_price ? String(product.cost_price) : "",
    weight_grams: product.weight_grams ? String(product.weight_grams) : "",
    stock_qty: String(product.stock_qty),
    low_stock_alert: String(product.low_stock_alert),
    is_active: product.is_active,
    is_featured: product.is_featured,
    meta_title: product.meta_title ?? "",
    meta_description: product.meta_description ?? "",
  };

  const initialImages = (product.product_images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    is_primary: img.is_primary,
    sort_order: img.sort_order,
  }));

  const initialVariants = (product.product_variants ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku ?? "",
      barcode: v.barcode ?? "",
      retail_price: v.retail_price != null ? String(v.retail_price) : "",
      wholesale_price: v.wholesale_price != null ? String(v.wholesale_price) : "",
      stock_qty: String(v.stock_qty),
      image_url: v.image_url ?? "",
      sort_order: v.sort_order,
      is_active: v.is_active,
    }));

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-body">
          ← สินค้าทั้งหมด
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-heading font-bold text-2xl text-gray-900">แก้ไข: {product.name}</h1>
      </div>

      <ProductForm
        categories={categories ?? []}
        initialData={initialData}
        initialImages={initialImages}
        initialVariants={initialVariants}
        mode="edit"
      />
    </div>
  );
}
