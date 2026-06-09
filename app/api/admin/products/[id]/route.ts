import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "next-auth";

function isAdmin(session: Session | null): boolean {
  return (session?.user as { userType?: string })?.userType === "admin";
}

interface Props {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id]
export async function GET(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .select(`*, categories (id, name, slug), product_images (*), product_variants (*)`)
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  return NextResponse.json({ data });
}

// PUT /api/admin/products/[id]
export async function PUT(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const {
    category_id, name, slug, sku, barcode,
    short_description, description,
    retail_price, wholesale_price, cost_price,
    weight_grams, stock_qty, low_stock_alert,
    is_active, is_featured,
    meta_title, meta_description,
  } = body;

  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .update({
      category_id: category_id || null,
      name, slug, sku: sku || null, barcode: barcode || null,
      short_description: short_description || null,
      description: description || null,
      retail_price: parseFloat(retail_price),
      wholesale_price: wholesale_price ? parseFloat(wholesale_price) : null,
      cost_price: cost_price ? parseFloat(cost_price) : null,
      weight_grams: weight_grams ? parseInt(weight_grams) : null,
      stock_qty: parseInt(stock_qty ?? 0),
      low_stock_alert: parseInt(low_stock_alert ?? 10),
      is_active: is_active ?? true,
      is_featured: is_featured ?? false,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug หรือ SKU นี้มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/admin/products/[id]
export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServerSupabaseClient();

  // Delete product images from storage first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: images } = await (supabase as any)
    .from("product_images")
    .select("url")
    .eq("product_id", id) as { data: { url: string }[] | null };

  if (images?.length) {
    const paths = images.map((img) => img.url.split("/product-images/")[1]).filter(Boolean);
    if (paths.length) {
      await supabase.storage.from("product-images").remove(paths);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
