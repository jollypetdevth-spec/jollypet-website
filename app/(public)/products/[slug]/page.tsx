import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProducts, categoryEmoji, categoryBg } from "@/lib/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categorySlug = product.category?.slug ?? "";
  const bg = categoryBg[categorySlug] ?? "bg-gray-50";
  const emoji = categoryEmoji[categorySlug] ?? "📦";

  const isOutOfStock = product.stock_qty === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 font-body mb-8">
        <Link href="/" className="hover:text-jolly-navy">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-jolly-navy">สินค้า</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/products?category=${categorySlug}`} className="hover:text-jolly-navy">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className={`${bg} rounded-2xl aspect-square flex items-center justify-center text-8xl`}>
          {emoji}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Category badge */}
          <span className="inline-block text-xs font-medium text-jolly-navy bg-jolly-navy/10 rounded-full px-3 py-1">
            {product.category?.name}
          </span>

          {/* Name */}
          <h1 className="font-heading font-bold text-3xl text-gray-900">{product.name}</h1>

          {/* Short desc */}
          {product.short_description && (
            <p className="font-body text-gray-600 text-lg">{product.short_description}</p>
          )}

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-bold text-3xl text-gray-900">
                ฿{product.retail_price.toLocaleString("th-TH")}
              </span>
              {product.weight_grams && (
                <span className="text-gray-500 font-body">/ {product.weight_grams}g</span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-body">
              * ราคาส่ง: สมัครสมาชิกและ Login เพื่อดูราคาพิเศษ
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <span className="badge bg-red-100 text-red-700">สินค้าหมด</span>
            ) : product.stock_qty <= product.low_stock_alert ? (
              <span className="badge bg-amber-100 text-amber-700">สินค้าใกล้หมด (เหลือ {product.stock_qty})</span>
            ) : (
              <span className="badge bg-green-100 text-green-700">มีสินค้า</span>
            )}
          </div>

          {/* Add to cart placeholder */}
          <div className="flex gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-l-lg font-heading">−</button>
              <span className="px-4 py-3 font-heading font-medium">1</span>
              <button className="px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-r-lg font-heading">+</button>
            </div>
            <button
              disabled={isOutOfStock}
              className="btn-primary flex-1 py-3 text-base disabled:opacity-50"
            >
              {isOutOfStock ? "สินค้าหมด" : "🛒 เพิ่มลงตะกร้า"}
            </button>
          </div>

          {/* Details */}
          <div className="border-t pt-5 space-y-2">
            {product.sku && (
              <div className="flex gap-2 text-sm font-body">
                <span className="text-gray-500 w-20 flex-shrink-0">รหัสสินค้า</span>
                <span className="text-gray-900">{product.sku}</span>
              </div>
            )}
            {product.barcode && (
              <div className="flex gap-2 text-sm font-body">
                <span className="text-gray-500 w-20 flex-shrink-0">Barcode</span>
                <span className="text-gray-900">{product.barcode}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className="flex gap-2 text-sm font-body">
                <span className="text-gray-500 w-20 flex-shrink-0">น้ำหนัก</span>
                <span className="text-gray-900">{product.weight_grams} กรัม</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12 border-t pt-10">
          <h2 className="font-heading font-bold text-2xl text-jolly-navy mb-4">รายละเอียดสินค้า</h2>
          <p className="font-body text-gray-700 leading-relaxed max-w-3xl">{product.description}</p>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link href="/products" className="btn-outline inline-flex">
          ← กลับไปดูสินค้าทั้งหมด
        </Link>
      </div>
    </div>
  );
}
