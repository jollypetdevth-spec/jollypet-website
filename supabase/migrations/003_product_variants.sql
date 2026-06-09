-- =====================================================
-- Jolly Pet — Product Variants
-- Run in Supabase SQL Editor after 002_seed_products.sql
-- =====================================================

CREATE TABLE public.product_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,                     -- e.g. "รสนม", "รสเนื้อย่าง", "360ml"
  sku             TEXT,
  barcode         TEXT,
  retail_price    NUMERIC(10,2),                     -- NULL = ใช้ราคาจาก products
  wholesale_price NUMERIC(10,2),                     -- NULL = ใช้ราคาจาก products
  stock_qty       INTEGER NOT NULL DEFAULT 0,
  image_url       TEXT,                              -- รูปเฉพาะ variant นี้ (optional)
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);

-- Auto-update updated_at
CREATE TRIGGER trg_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_public_read" ON public.product_variants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "variants_admin_all" ON public.product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
