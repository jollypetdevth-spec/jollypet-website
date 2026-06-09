import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import type { Session } from "next-auth";

function isAdmin(session: Session | null): boolean {
  return (session?.user as { userType?: string })?.userType === "admin";
}

// POST /api/admin/upload — upload product image to Supabase Storage
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;

  if (!file) return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });

  // Validate type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WEBP" }, { status: 400 });
  }
  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "ขนาดไฟล์ต้องไม่เกิน 5MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${productId ?? "temp"}/${randomUUID()}.${ext}`;

  const supabase = createServerSupabaseClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
