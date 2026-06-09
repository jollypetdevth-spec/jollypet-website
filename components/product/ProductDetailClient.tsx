"use client";

import { useState } from "react";
import ProductImageGallery from "./ProductImageGallery";
import ProductVariantSelector from "./ProductVariantSelector";

interface GalleryImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text: string | null;
}

interface Variant {
  id: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  retail_price: number | null;
  wholesale_price: number | null;
  stock_qty: number;
  image_url: string | null;
  is_active: boolean;
}

interface Props {
  images: GalleryImage[];
  variants: Variant[];
  baseRetailPrice: number;
  baseWholesalePrice: number | null;
  baseStockQty: number;
  baseLowStockAlert: number;
  fallbackEmoji: string;
  fallbackBg: string;
  productName: string;
  showWholesale: boolean;
}

export default function ProductDetailClient({
  images,
  variants,
  baseRetailPrice,
  baseWholesalePrice,
  baseStockQty,
  baseLowStockAlert,
  fallbackEmoji,
  fallbackBg,
  productName,
  showWholesale,
}: Props) {
  const hasVariants = variants.filter((v) => v.is_active).length > 0;

  // When a variant with its own image is selected, override gallery
  const [variantImageUrl, setVariantImageUrl] = useState<string | null>(
    hasVariants ? (variants.find((v) => v.is_active)?.image_url ?? null) : null
  );

  // Build image list: if variant has an image, prepend it as primary
  const displayImages: GalleryImage[] =
    variantImageUrl
      ? [{ url: variantImageUrl, is_primary: true, sort_order: -1, alt_text: null }, ...images]
      : images;

  // If no variants, show simple price + stock
  const retailPrice = baseRetailPrice;
  const isOutOfStock = !hasVariants && baseStockQty === 0;
  const isLowStock = !hasVariants && baseStockQty > 0 && baseStockQty <= baseLowStockAlert;

  return (
    <>
      {/* Left col: gallery */}
      <ProductImageGallery
        images={displayImages}
        productName={productName}
        fallbackEmoji={fallbackEmoji}
        fallbackBg={fallbackBg}
      />

      {/* Right col: info */}
      <div className="space-y-5">
        {/* Variants or plain price */}
        {hasVariants ? (
          <ProductVariantSelector
            variants={variants}
            baseRetailPrice={baseRetailPrice}
            baseWholesalePrice={baseWholesalePrice}
            baseLowStockAlert={baseLowStockAlert}
            fallbackEmoji={fallbackEmoji}
            fallbackBg={fallbackBg}
            productName={productName}
            onVariantChange={setVariantImageUrl}
            showWholesale={showWholesale}
          />
        ) : (
          <>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-heading font-bold text-3xl text-gray-900">
                  ฿{retailPrice.toLocaleString("th-TH")}
                </span>
              </div>
              {showWholesale && baseWholesalePrice && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-white bg-jolly-navy rounded px-2 py-0.5 font-heading">ราคาส่ง B2B</span>
                  <span className="font-heading font-semibold text-jolly-navy">
                    ฿{baseWholesalePrice.toLocaleString("th-TH")}
                  </span>
                </div>
              )}
              {!showWholesale && baseWholesalePrice && (
                <p className="text-xs text-gray-400 font-body">
                  🔒 <a href="/register" className="underline hover:text-jolly-navy">สมัครสมาชิก B2B</a> หรือ{" "}
                  <a href="/login" className="underline hover:text-jolly-navy">Login</a> เพื่อดูราคาส่ง
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="badge bg-red-100 text-red-700">สินค้าหมด</span>
              ) : isLowStock ? (
                <span className="badge bg-amber-100 text-amber-700">
                  สินค้าใกล้หมด (เหลือ {baseStockQty})
                </span>
              ) : (
                <span className="badge bg-green-100 text-green-700">มีสินค้า</span>
              )}
            </div>
          </>
        )}

        {/* Add to cart */}
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
      </div>
    </>
  );
}
