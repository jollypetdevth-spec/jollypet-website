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

// PUT /api/admin/products/[id]/variants — replace all variants (upsert)
export async function PUT(req: NextRequest, { params }: Props) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: productId } = await params;
  const { variants } = await req.json() as {
    variants: Array<{
      id?: string;
      name: string;
      sku?: string;
      barcode?: string;
      retail_price?: number | null;
      wholesale_price?: number | null;
      stock_qty: number;
      image_url?: string | null;
      sort_order: number;
      is_active?: boolean;
    }>;
  };

  if (!Array.isArray(variants)) {
    return NextResponse.json({ error: "variants must be an array" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  // Collect IDs of variants being kept
  const keepIds = variants.filter((v) => v.id).map((v) => v.id!);

  // Delete variants not in the new list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  if (keepIds.length > 0) {
    await sb
      .from("product_variants")
      .delete()
      .eq("product_id", productId)
      .not("id", "in", `(${keepIds.join(",")})`);
  } else {
    // Delete all existing variants for this product
    await sb.from("product_variants").delete().eq("product_id", productId);
  }

  if (variants.length === 0) {
    return NextResponse.json({ data: [] });
  }

  // Upsert all variants
  const rows = variants.map((v, i) => ({
    ...(v.id ? { id: v.id } : {}),
    product_id: productId,
    name: v.name,
    sku: v.sku || null,
    barcode: v.barcode || null,
    retail_price: v.retail_price ?? null,
    wholesale_price: v.wholesale_price ?? null,
    stock_qty: v.stock_qty ?? 0,
    image_url: v.image_url || null,
    sort_order: v.sort_order ?? i,
    is_active: v.is_active ?? true,
  }));

  const { data, error } = await sb
    .from("product_variants")
    .upsert(rows, { onConflict: "id" })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
