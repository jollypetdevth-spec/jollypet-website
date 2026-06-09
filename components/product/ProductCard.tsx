import Link from "next/link";
import type { Product } from "@/types";
import { categoryBg, categoryEmoji } from "@/lib/data/products";

interface ProductCardProps {
  product: Product;
  showWholesale?: boolean; // true เฉพาะ B2B login
}

export default function ProductCard({ product, showWholesale = false }: ProductCardProps) {
  const categorySlug = product.category?.slug ?? "";
  const bg = categoryBg[categorySlug] ?? "bg-gray-50";
  const emoji = categoryEmoji[categorySlug] ?? "📦";

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card h-full flex flex-col">
        {/* Image placeholder */}
        <div className={`${bg} aspect-square flex items-center justify-center text-5xl`}>
          {emoji}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category badge */}
          <span className="text-xs font-medium text-jolly-navy bg-jolly-navy/10 rounded-full px-2 py-0.5 w-fit mb-2">
            {product.category?.name}
          </span>

          {/* Name */}
          <h3 className="font-heading font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-jolly-navy transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Short description */}
          {product.short_description && (
            <p className="text-xs text-gray-500 font-body line-clamp-2 mb-3 flex-1">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-lg text-gray-900">
                ฿{product.retail_price.toLocaleString("th-TH")}
              </span>
              {product.weight_grams && (
                <span className="text-xs text-gray-400">
                  / {product.weight_grams}g
                </span>
              )}
            </div>
            {showWholesale && product.wholesale_price && (
              <div className="text-xs text-jolly-navy font-medium mt-0.5">
                ราคาส่ง: ฿{product.wholesale_price.toLocaleString("th-TH")}
                <span className="text-gray-400"> (ขั้นต่ำ {product.min_wholesale_qty} ชิ้น)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
