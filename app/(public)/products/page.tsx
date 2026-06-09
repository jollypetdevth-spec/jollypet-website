import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type CategoryRow = { id: string; name: string; slug: string };
type ProductRow = {
  id: string; name: string; slug: string; short_description: string | null;
  retail_price: number; wholesale_price: number | null; weight_grams: number | null;
  stock_qty: number; low_stock_alert: number; is_featured: boolean;
  categories: CategoryRow | null;
  product_images: { url: string; is_primary: boolean; sort_order: number }[];
};

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
  description: "สินค้าสัตว์เลี้ยงคุณภาพสูงจาก Jolly Pet ครบทั้ง Dog Snack, Pet Care และ Home Care",
};

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, q } = await searchParams;
  const activeCategory = category ?? "all";
  const searchQuery = q ?? "";

  const supabase = createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order") as { data: CategoryRow[] | null };

  // Fetch products
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("products")
    .select(`
      id, name, slug, short_description,
      retail_price, wholesale_price, weight_grams,
      stock_qty, low_stock_alert, is_featured,
      categories (id, name, slug),
      product_images (url, is_primary, sort_order)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (activeCategory !== "all") {
    // Join via categories slug
    const cat = categories?.find((c) => c.slug === activeCategory);
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  const { data: products } = await query as { data: ProductRow[] | null };

  const activeCategoryName = categories?.find((c) => c.slug === activeCategory)?.name;

  return (
    <>
      {/* Header */}
      <section className="bg-jolly-navy text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">สินค้าทั้งหมด</h1>
          <p className="font-body text-gray-300">
            {products?.length ?? 0} รายการ
            {activeCategory !== "all" && activeCategoryName && ` ในหมวด ${activeCategoryName}`}
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter + Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-sm font-medium font-heading transition-colors ${
                  activeCategory === "all"
                    ? "bg-jolly-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ทั้งหมด
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium font-heading transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-jolly-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Search */}
            <form className="ml-auto flex gap-2">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="ค้นหาสินค้า..."
                className="input max-w-xs"
              />
              {activeCategory !== "all" && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
              <button type="submit" className="btn-secondary px-4">ค้นหา</button>
            </form>
          </div>

          {/* Product Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    category: Array.isArray(product.categories)
                      ? product.categories[0]
                      : product.categories ?? undefined,
                    images: product.product_images ?? [],
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-heading font-medium text-lg">ไม่พบสินค้าที่ค้นหา</p>
              <Link href="/products" className="btn-outline mt-4 inline-block">
                ดูสินค้าทั้งหมด
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
