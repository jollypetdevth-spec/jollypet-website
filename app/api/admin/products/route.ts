import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "next-auth";

function isAdmin(session: Session | null): boolean {
  return (session?.user as { userType?: string })?.userType === "admin";
}

// GET /api/admin/products — list all products with category
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("products")
    .select(`
      id, name, slug, sku, retail_price, wholesale_price,
      stock_qty, is_active, is_featured, created_at,
      categories (id, name, slug)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.ilike("name", `%${search}%`);
  if (category) query = query.eq("category_id", category);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, page, limit });
}

// POST /api/admin/products — create product
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    category_id, name, slug, sku, barcode,
    short_description, description,
    retail_price, wholesale_price, cost_price,
    weight_grams, stock_qty, low_stock_alert,
    is_active, is_featured,
    meta_title, meta_description,
  } = body;

  if (!name || !slug || retail_price === undefined) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, slug, ราคาปลีก)" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("products")
    .insert({
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
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug หรือ SKU นี้มีอยู่แล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
