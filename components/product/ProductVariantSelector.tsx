"use client";

import { useState } from "react";
import Image from "next/image";

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
  variants: Variant[];
  baseRetailPrice: number;
  baseWholesalePrice: number | null;
  baseLowStockAlert: number;
  fallbackEmoji: string;
  fallbackBg: string;
  productName: string;
  showWholesale: boolean;
  /** Callback so parent (detail page) can swap the main gallery image */
  onVariantChange?: (variantImageUrl: string | null) => void;
}

export default function ProductVariantSelector({
  variants,
  baseRetailPrice,
  baseWholesalePrice,
  baseLowStockAlert,
  showWholesale,
  onVariantChange,
}: Props) {
  const activeVariants = variants.filter((v) => v.is_active);
  const [selected, setSelected] = useState<Variant | null>(
    activeVariants.length > 0 ? activeVariants[0] : null
  );

  if (activeVariants.length === 0) return null;

  function select(v: Variant) {
    setSelected(v);
    onVariantChange?.(v.image_url);
  }

  const retailPrice = selected?.retail_price ?? baseRetailPrice;
  const wholesalePrice = selected?.wholesale_price ?? baseWholesalePrice;
  const stock = selected?.stock_qty ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= baseLowStockAlert;

  return (
    <div className="space-y-4">
      {/* Variant buttons */}
      <div>
        <p className="text-sm font-body text-gray-500 mb-2">เลือก Variant:</p>
        <div className="flex flex-wrap gap-2">
          {activeVariants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => select(v)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-heading transition-all ${
                selected?.id === v.id
                  ? "border-jolly-navy bg-jolly-navy text-white"
                  : "border-gray-200 text-gray-700 hover:border-jolly-navy/50"
              } ${v.stock_qty === 0 ? "opacity-50 line-through cursor-not-allowed" : "cursor-pointer"}`}
              disabled={v.stock_qty === 0}
            >
              {v.image_url && (
                <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                  <Image src={v.image_url} alt={v.name} fill className="object-cover" sizes="24px" />
                </div>
              )}
              {v.name}
              {v.stock_qty === 0 && (
                <span className="text-xs ml-1 opacity-70">(หมด)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price for selected variant */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-heading font-bold text-3xl text-gray-900">
            ฿{retailPrice.toLocaleString("th-TH")}
          </span>
        </div>
        {showWholesale && wholesalePrice && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-white bg-jolly-navy rounded px-2 py-0.5 font-heading">ราคาส่ง B2B</span>
            <span className="font-heading font-semibold text-jolly-navy">
              ฿{wholesalePrice.toLocaleString("th-TH")}
            </span>
          </div>
        )}
        {!showWholesale && (baseWholesalePrice != null || wholesalePrice != null) && (
          <p className="text-xs text-gray-400 font-body">
            🔒 <a href="/register" className="underline hover:text-jolly-navy">สมัครสมาชิก B2B</a> หรือ{" "}
            <a href="/login" className="underline hover:text-jolly-navy">Login</a> เพื่อดูราคาส่ง
          </p>
        )}
      </div>

      {/* Stock badge */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <span className="badge bg-red-100 text-red-700">สินค้าหมด</span>
        ) : isLowStock ? (
          <span className="badge bg-amber-100 text-amber-700">สินค้าใกล้หมด (เหลือ {stock})</span>
        ) : (
          <span className="badge bg-green-100 text-green-700">มีสินค้า</span>
        )}
      </div>

      {/* SKU / Barcode of selected variant */}
      {selected && (selected.sku || selected.barcode) && (
        <div className="border-t pt-3 flex flex-wrap gap-x-6 gap-y-1">
          {selected.sku && (
            <div className="flex gap-2 text-sm font-body">
              <span className="text-gray-400 w-20 flex-shrink-0">รหัสสินค้า</span>
              <span className="text-gray-700">{selected.sku}</span>
            </div>
          )}
          {selected.barcode && (
            <div className="flex gap-2 text-sm font-body">
              <span className="text-gray-400 w-20 flex-shrink-0">Barcode</span>
              <span className="text-gray-700 font-mono">{selected.barcode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
