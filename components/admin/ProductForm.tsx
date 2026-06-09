"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  id?: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface VariantRow {
  id?: string;
  name: string;
  sku: string;
  barcode: string;
  retail_price: string;
  wholesale_price: string;
  stock_qty: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

interface ProductFormData {
  id?: string;
  category_id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  short_description: string;
  description: string;
  retail_price: string;
  wholesale_price: string;
  cost_price: string;
  weight_grams: string;
  stock_qty: string;
  low_stock_alert: string;
  is_active: boolean;
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
}

interface Props {
  categories: Category[];
  initialData?: Partial<ProductFormData>;
  initialImages?: ProductImage[];
  initialVariants?: VariantRow[];
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w฀-๿-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY_VARIANT: VariantRow = {
  name: "",
  sku: "",
  barcode: "",
  retail_price: "",
  wholesale_price: "",
  stock_qty: "0",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function ProductForm({
  categories,
  initialData,
  initialImages = [],
  initialVariants = [],
  mode,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    id: initialData?.id ?? "",
    category_id: initialData?.category_id ?? "",
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    sku: initialData?.sku ?? "",
    barcode: initialData?.barcode ?? "",
    short_description: initialData?.short_description ?? "",
    description: initialData?.description ?? "",
    retail_price: initialData?.retail_price ?? "",
    wholesale_price: initialData?.wholesale_price ?? "",
    cost_price: initialData?.cost_price ?? "",
    weight_grams: initialData?.weight_grams ?? "",
    stock_qty: initialData?.stock_qty ?? "0",
    low_stock_alert: initialData?.low_stock_alert ?? "10",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
  });

  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
  const [uploading, setUploading] = useState(false);
  const [uploadingVariantIdx, setUploadingVariantIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // one hidden file-input ref per variant slot (indexed)
  const variantFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Form handlers ──────────────────────────────────────────────

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? slugify(name) : prev.slug,
    }));
  }

  // ── Image handlers ─────────────────────────────────────────────

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newImages: ProductImage[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      if (form.id) fd.append("productId", form.id);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        newImages.push({
          url: data.url,
          is_primary: images.length === 0 && newImages.length === 0,
          sort_order: images.length + newImages.length,
        });
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index].is_primary && next.length > 0) next[0].is_primary = true;
      return next;
    });
  }

  function setPrimary(index: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, is_primary: i === index })));
  }

  // ── Variant handlers ───────────────────────────────────────────

  async function handleVariantImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVariantIdx(index);
    const fd = new FormData();
    fd.append("file", file);
    // use product id if available, else a temp bucket path
    fd.append("productId", form.id || "variants-temp");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setVariants((prev) =>
        prev.map((v, i) => (i === index ? { ...v, image_url: data.url } : v))
      );
    }
    setUploadingVariantIdx(null);
    e.target.value = "";
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { ...EMPTY_VARIANT, sort_order: prev.length },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function handleVariantChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type, checked } = e.target;
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [name]: type === "checkbox" ? checked : value } : v
      )
    );
  }

  // ── Submit ─────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${form.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด");
      setSaving(false);
      return;
    }

    const productId = mode === "create" ? data.data?.id : form.id;

    // Save images + variants in parallel
    await Promise.all([
      images.length > 0 ? saveImages(productId) : Promise.resolve(),
      saveVariants(productId),
    ]);

    router.push("/admin/products");
    router.refresh();
  }

  async function saveImages(productId: string) {
    await fetch("/api/admin/products/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, images }),
    });
  }

  async function saveVariants(productId: string) {
    const payload = variants.map((v, i) => ({
      ...(v.id ? { id: v.id } : {}),
      name: v.name,
      sku: v.sku || null,
      barcode: v.barcode || null,
      retail_price: v.retail_price ? parseFloat(v.retail_price) : null,
      wholesale_price: v.wholesale_price ? parseFloat(v.wholesale_price) : null,
      stock_qty: parseInt(v.stock_qty) || 0,
      image_url: v.image_url || null,
      sort_order: i,
      is_active: v.is_active,
    }));

    await fetch(`/api/admin/products/${productId}/variants`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variants: payload }),
    });
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body">
          {error}
        </div>
      )}

      {/* ── Basic Info ── */}
      <section className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900 mb-5">ข้อมูลพื้นฐาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">ชื่อสินค้า *</label>
            <input
              type="text" name="name" className="input"
              placeholder="เช่น จอยไบท์ จุ๊ยซี่คิวป์"
              value={form.name} onChange={handleNameChange} required
            />
          </div>
          <div>
            <label className="label">Slug (URL) *</label>
            <input
              type="text" name="slug" className="input font-mono text-sm"
              placeholder="joybite-juicy-cube"
              value={form.slug} onChange={handleChange} required
            />
            <p className="text-xs text-gray-400 mt-1 font-body">URL: /products/{form.slug || "..."}</p>
          </div>
          <div>
            <label className="label">หมวดหมู่</label>
            <select name="category_id" className="input" value={form.category_id} onChange={handleChange}>
              <option value="">-- ไม่ระบุ --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">รหัสสินค้า (SKU)</label>
            <input type="text" name="sku" className="input" placeholder="JP-001" value={form.sku} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Barcode</label>
            <input type="text" name="barcode" className="input" placeholder="8851234567890" value={form.barcode} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="label">คำอธิบายสั้น</label>
            <input type="text" name="short_description" className="input" placeholder="คำอธิบาย 1 บรรทัด" value={form.short_description} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <label className="label">รายละเอียดสินค้า</label>
            <textarea name="description" className="input resize-none" rows={4} placeholder="รายละเอียดเพิ่มเติม..." value={form.description} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* ── Pricing (base) ── */}
      <section className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900 mb-1">ราคาและสต็อกหลัก</h2>
        <p className="text-sm text-gray-500 font-body mb-5">
          ถ้ามี Variants ด้านล่าง ราคา/สต็อกของแต่ละ Variant จะใช้แทน ถ้าไม่ได้กำหนดใน Variant จะ fallback มาที่นี่
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">ราคาปลีก (฿) *</label>
            <input type="number" name="retail_price" className="input" placeholder="0.00" min="0" step="0.01" value={form.retail_price} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">ราคาส่ง (฿)</label>
            <input type="number" name="wholesale_price" className="input" placeholder="0.00" min="0" step="0.01" value={form.wholesale_price} onChange={handleChange} />
            <p className="text-xs text-gray-400 mt-1 font-body">แสดงเฉพาะลูกค้า B2B ที่ได้รับอนุมัติ</p>
          </div>
          <div>
            <label className="label">ราคาทุน (฿)</label>
            <input type="number" name="cost_price" className="input" placeholder="0.00" min="0" step="0.01" value={form.cost_price} onChange={handleChange} />
            <p className="text-xs text-gray-400 mt-1 font-body">ใช้คำนวณกำไร (ไม่แสดงหน้าเว็บ)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="label">จำนวนในสต็อก *</label>
            <input type="number" name="stock_qty" className="input" min="0" value={form.stock_qty} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">แจ้งเตือนเมื่อเหลือ</label>
            <input type="number" name="low_stock_alert" className="input" min="0" value={form.low_stock_alert} onChange={handleChange} />
          </div>
          <div>
            <label className="label">น้ำหนัก (กรัม)</label>
            <input type="number" name="weight_grams" className="input" min="0" placeholder="100" value={form.weight_grams} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* ── Variants ── */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-heading font-semibold text-lg text-gray-900">Variants (รสชาติ / ขนาด)</h2>
            <p className="text-sm text-gray-500 font-body mt-0.5">เพิ่มตัวเลือกย่อย เช่น รสนม, รสเนื้อย่าง, 100g, 250g — แต่ละ Variant มีราคา/สต็อกแยกกันได้</p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="btn-secondary text-sm px-4 py-2 flex-shrink-0"
          >
            + เพิ่ม Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 font-body mt-4">
            ยังไม่มี Variant — กดปุ่ม &ldquo;+ เพิ่ม Variant&rdquo; เพื่อเพิ่มรสชาติหรือขนาด
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {variants.map((v, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-heading font-medium text-sm text-gray-500 w-6 text-center">{i + 1}</span>
                  <input
                    type="text"
                    name="name"
                    className="input flex-1 font-medium"
                    placeholder="ชื่อ Variant เช่น รสนม, 250g, สีแดง"
                    value={v.name}
                    onChange={(e) => handleVariantChange(i, e)}
                    required
                  />
                  <label className="flex items-center gap-1.5 text-sm font-body text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={v.is_active}
                      onChange={(e) => handleVariantChange(i, e)}
                      className="accent-jolly-navy"
                    />
                    แสดง
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1"
                    title="ลบ Variant"
                  >
                    ✕
                  </button>
                </div>

                {/* Detail row — pricing + stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-8 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 font-body mb-1 block">ราคาปลีก (฿)</label>
                    <input
                      type="number" name="retail_price" className="input text-sm" placeholder="เว้นว่าง = ใช้ราคาหลัก"
                      min="0" step="0.01" value={v.retail_price}
                      onChange={(e) => handleVariantChange(i, e)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-body mb-1 block">ราคาส่ง (฿)</label>
                    <input
                      type="number" name="wholesale_price" className="input text-sm" placeholder="เว้นว่าง = ใช้ราคาหลัก"
                      min="0" step="0.01" value={v.wholesale_price}
                      onChange={(e) => handleVariantChange(i, e)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-body mb-1 block">สต็อก *</label>
                    <input
                      type="number" name="stock_qty" className="input text-sm"
                      min="0" value={v.stock_qty}
                      onChange={(e) => handleVariantChange(i, e)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-body mb-1 block">SKU</label>
                    <input
                      type="text" name="sku" className="input text-sm" placeholder="JP-001-MILK"
                      value={v.sku}
                      onChange={(e) => handleVariantChange(i, e)}
                    />
                  </div>
                </div>

                {/* Detail row — barcode + image */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-8 items-end">
                  <div className="md:col-span-1">
                    <label className="text-xs text-gray-500 font-body mb-1 block">Barcode</label>
                    <input
                      type="text" name="barcode" className="input text-sm" placeholder="8851234567890"
                      value={v.barcode}
                      onChange={(e) => handleVariantChange(i, e)}
                    />
                  </div>

                  {/* Variant image upload */}
                  <div className="md:col-span-3 flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 font-body mb-1 block">รูป Variant</label>
                      <div className="flex items-center gap-2">
                        {/* Thumbnail preview */}
                        {v.image_url ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image src={v.image_url} alt={v.name} fill className="object-cover" sizes="56px" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-300 text-xl">
                            🖼
                          </div>
                        )}
                        {/* Upload button */}
                        <div className="flex flex-col gap-1 flex-1">
                          <label
                            className={`btn-secondary text-xs px-3 py-2 cursor-pointer text-center ${uploadingVariantIdx === i ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            {uploadingVariantIdx === i ? "⏳ กำลังอัปโหลด..." : "📤 อัปโหลดรูป"}
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              className="hidden"
                              ref={(el) => { variantFileRefs.current[i] = el; }}
                              onChange={(e) => handleVariantImageUpload(i, e)}
                              disabled={uploadingVariantIdx !== null}
                            />
                          </label>
                          {v.image_url && (
                            <button
                              type="button"
                              className="text-xs text-red-400 hover:text-red-600 font-body"
                              onClick={() => setVariants((prev) => prev.map((vv, ii) => ii === i ? { ...vv, image_url: "" } : vv))}
                            >
                              ลบรูป
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Images ── */}
      <section className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900 mb-2">รูปภาพสินค้า</h2>
        <p className="text-sm text-gray-500 font-body mb-5">JPG, PNG, WEBP — ไม่เกิน 5MB ต่อรูป คลิกดาวเพื่อตั้งเป็นรูปหลัก</p>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className={`relative group rounded-xl overflow-hidden border-2 ${img.is_primary ? "border-jolly-yellow" : "border-gray-200"}`}>
                <div className="aspect-square relative bg-gray-50">
                  <Image src={img.url} alt={`product-${i}`} fill className="object-cover" sizes="200px" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setPrimary(i)}
                    className="w-8 h-8 rounded-full bg-jolly-yellow text-jolly-navy font-bold text-sm flex items-center justify-center" title="ตั้งเป็นรูปหลัก">★</button>
                  <button type="button" onClick={() => removeImage(i)}
                    className="w-8 h-8 rounded-full bg-red-500 text-white font-bold text-sm flex items-center justify-center" title="ลบรูป">✕</button>
                </div>
                {img.is_primary && (
                  <div className="absolute top-1 left-1 bg-jolly-yellow text-jolly-navy text-xs font-bold px-1.5 py-0.5 rounded font-heading">หลัก</div>
                )}
              </div>
            ))}
          </div>
        )}
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-jolly-navy/50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          <span className="text-3xl mb-2">{uploading ? "⏳" : "📤"}</span>
          <span className="font-heading font-medium text-gray-700">{uploading ? "กำลังอัปโหลด..." : "คลิกหรือลากไฟล์มาวางที่นี่"}</span>
          <span className="text-xs text-gray-400 mt-1 font-body">เลือกได้หลายรูป</span>
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
      </section>

      {/* ── Status ── */}
      <section className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900 mb-5">การแสดงผล</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-jolly-navy" />
            <div>
              <span className="font-body font-medium text-gray-900">แสดงสินค้า</span>
              <p className="text-xs text-gray-400 font-body">ถ้าปิด สินค้าจะไม่แสดงในหน้าเว็บ</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 accent-jolly-navy" />
            <div>
              <span className="font-body font-medium text-gray-900">สินค้าแนะนำ</span>
              <p className="text-xs text-gray-400 font-body">แสดงใน Featured section ในหน้าแรก</p>
            </div>
          </label>
        </div>
      </section>

      {/* ── SEO ── */}
      <section className="card p-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900 mb-5">SEO (ไม่บังคับ)</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Title tag</label>
            <input type="text" name="meta_title" className="input" placeholder="เว้นว่างเพื่อใช้ชื่อสินค้า" value={form.meta_title} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Meta description</label>
            <textarea name="meta_description" className="input resize-none" rows={2} placeholder="คำอธิบายสำหรับ Google" value={form.meta_description} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-4 pt-2 pb-8">
        <button type="submit" className="btn-primary px-8 py-3 text-base" disabled={saving}>
          {saving ? "กำลังบันทึก..." : mode === "create" ? "สร้างสินค้า" : "บันทึกการเปลี่ยนแปลง"}
        </button>
        <button type="button" className="btn-outline px-8 py-3 text-base" onClick={() => router.push("/admin/products")} disabled={saving}>
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
