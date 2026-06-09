import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Session } from "next-auth";

function isAdmin(session: Session | null): boolean {
  return (session?.user as { userType?: string })?.userType === "admin";
}

// POST /api/admin/products/images — replace all images for a product
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, images } = await req.json();
  if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  const supabase = createServerSupabaseClient();

  // Delete existing images
  await supabase.from("product_images").delete().eq("product_id", productId);

  if (!images?.length) return NextResponse.json({ success: true });

  // Insert new images
  const rows = images.map((img: { url: string; is_primary: boolean; sort_order: number }, i: number) => ({
    product_id: productId,
    url: img.url,
    is_primary: img.is_primary,
    sort_order: img.sort_order ?? i,
  }));

  const { error } = await supabase.from("product_images").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
