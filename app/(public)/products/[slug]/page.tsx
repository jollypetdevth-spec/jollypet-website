import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { categoryEmoji, categoryBg } from "@/lib/data/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { auth } from "@/lib/auth/config";

interface Props {
  params: Promise<{ slug: string }>;
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  barcode: string | null;
  short_description: string | null;
  description: string | null;
  retail_price: number;
  wholesale_price: number | null;
  weight_grams: number | null;
  stock_qty: number;
  low_stock_alert: number;
  meta_title: string | null;
  meta_description: string | null;
  categories: { id: string; name: string; slug: string } | null;
  product_images: { url: string; is_primary: boolean; sort_order: number; alt_text: string | null }[];
  product_variants: { id: string; name: string; sku: string | null; barcode: string | null; retail_price: number | null; wholesale_price: number | null; stock_qty: number; image_url: string | null; sort_order: number; is_active: boolean }[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("products")
    .select("name, meta_title, meta_description, short_description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single() as { data: { name: string; meta_title: string | null; meta_description: string | null; short_description: string | null } | null };
  if (!data) return {};
  return {
    title: data.meta_title ?? data.name,
    description: data.meta_description ?? data.short_description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = createServerSupabaseClient();

  // ── Wholesale visibility ──
  const session = await auth();
  const u = session?.user as { userType?: string; isApproved?: boolean } | undefined;
  const showWholesale =
    u?.userType === "admin" ||
    (u?.userType === "wholesale" && u?.isApproved === true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product, error } = await (supabase as any)
    .from("products")
    .select(`
      id, name, slug, sku, barcode,
      short_description, description,
      retail_price, wholesale_price,
      weight_grams, stock_qty, low_stock_alert,
      meta_title, meta_description,
      categories (id, name, slug),
      product_images (url, is_primary, sort_order, alt_text),
      product_variants (id, name, sku, barcode, retail_price, wholesale_price, stock_qty, image_url, sort_order, is_active)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single() as { data: ProductRow | null; error: unknown };

  if (error) console.error("[ProductDetail] Supabase error for slug:", slug, JSON.stringify(error));
  if (!product) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: debugProduct } = await (supabase as any)
      .from("products")
      .select("id, slug, is_active, name")
      .eq("slug", slug)
      .single() as { data: { id: string; slug: string; is_active: boolean; name: string } | null };
    if (debugProduct) {
      console.error(`[ProductDetail] Product found but is_active=${debugProduct.is_active}`);
    } else {
      console.error(`[ProductDetail] No product with slug="${slug}" in DB`);
    }
    notFound();
  }

  const categorySlug = product.categories?.slug ?? "";
  const bg = categoryBg[categorySlug] ?? "bg-gray-50";
  const emoji = categoryEmoji[categorySlug] ?? "📦";

  const sortedVariants = [...(product.product_variants ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 font-body mb-8">
        <Link href="/" className="hover:text-jolly-navy">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-jolly-navy">สินค้า</Link>
        <span>/</span>
        {product.categories && (
          <>
            <Link href={`/products?category=${categorySlug}`} className="hover:text-jolly-navy">
              {product.categories.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Category + Name (outside client component so it's SSR) */}
      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-jolly-navy bg-jolly-navy/10 rounded-full px-3 py-1 mb-3">
          {product.categories?.name}
        </span>
        <h1 className="font-heading font-bold text-3xl text-gray-900">{product.name}</h1>
        {product.short_description && (
          <p className="font-body text-gray-600 text-lg mt-2">{product.short_description}</p>
        )}
      </div>

      {/* Gallery + Variants (client) */}
      <div className="grid md:grid-cols-2 gap-12">
        <ProductDetailClient
          images={product.product_images ?? []}
          variants={sortedVariants}
          baseRetailPrice={product.retail_price}
          baseWholesalePrice={product.wholesale_price}
          baseStockQty={product.stock_qty}
          baseLowStockAlert={product.low_stock_alert}
          fallbackEmoji={emoji}
          fallbackBg={bg}
          productName={product.name}
          showWholesale={showWholesale}
        />
      </div>

      {/* Product info table */}
      <div className="mt-8 border-t pt-6 flex flex-wrap gap-x-8 gap-y-2">
        {product.sku && (
          <div className="flex gap-2 text-sm font-body">
            <span className="text-gray-500 w-24 flex-shrink-0">รหัสสินค้า</span>
            <span className="text-gray-900">{product.sku}</span>
          </div>
        )}
        {product.barcode && (
          <div className="flex gap-2 text-sm font-body">
            <span className="text-gray-500 w-24 flex-shrink-0">Barcode</span>
            <span className="text-gray-900">{product.barcode}</span>
          </div>
        )}
        {product.weight_grams && (
          <div className="flex gap-2 text-sm font-body">
            <span className="text-gray-500 w-24 flex-shrink-0">น้ำหนัก</span>
            <span className="text-gray-900">{product.weight_grams} กรัม</span>
          </div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-10 border-t pt-10">
          <h2 className="font-heading font-bold text-2xl text-jolly-navy mb-4">รายละเอียดสินค้า</h2>
          <p className="font-body text-gray-700 leading-relaxed max-w-3xl">{product.description}</p>
        </div>
      )}

      <div className="mt-10">
        <Link href="/products" className="btn-outline inline-flex">
          ← กลับไปดูสินค้าทั้งหมด
        </Link>
      </div>
    </div>
  );
}
