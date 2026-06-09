-- =====================================================
-- Jolly Pet — Initial Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

create type user_type as enum ('retail', 'wholesale', 'admin');
create type order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type payment_method as enum ('promptpay', 'bank_transfer', 'cash_on_delivery', 'credit_card');
create type document_type as enum ('invoice', 'receipt', 'tax_invoice', 'delivery_note');

-- =====================================================
-- USERS (extends Supabase auth.users)
-- =====================================================

create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  full_name     text not null,
  phone         text,
  company_name  text,
  tax_id        text,
  user_type     user_type not null default 'retail',
  is_approved   boolean not null default true,  -- wholesale accounts need manual approval
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Wholesale accounts are not auto-approved
create or replace function set_wholesale_pending()
returns trigger language plpgsql as $$
begin
  if new.user_type = 'wholesale' then
    new.is_approved := false;
  end if;
  return new;
end;
$$;

create trigger trg_wholesale_pending
  before insert on public.users
  for each row execute function set_wholesale_pending();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

-- =====================================================
-- ADDRESSES
-- =====================================================

create table public.addresses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users(id) on delete cascade,
  label       text default 'บ้าน',
  full_name   text not null,
  phone       text not null,
  address     text not null,
  district    text not null,
  city        text not null,
  province    text not null,
  postal_code text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- =====================================================
-- CATEGORIES
-- =====================================================

create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seed default categories
insert into public.categories (name, slug, sort_order) values
  ('Dog Snack', 'dog-snack', 1),
  ('Pet Care', 'pet-care', 2),
  ('Home Care', 'home-care', 3);

-- =====================================================
-- PRODUCTS
-- =====================================================

create table public.products (
  id               uuid primary key default uuid_generate_v4(),
  category_id      uuid references public.categories(id) on delete set null,
  name             text not null,
  slug             text not null unique,
  sku              text unique,
  barcode          text,
  short_description text,
  description      text,
  retail_price     numeric(10,2) not null,
  wholesale_price  numeric(10,2),
  cost_price       numeric(10,2),
  weight_grams     integer,
  stock_qty        integer not null default 0,
  low_stock_alert  integer not null default 10,
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function update_updated_at();

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================

create table public.product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  url         text not null,
  alt_text    text,
  sort_order  integer not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- =====================================================
-- INVENTORY LOGS
-- =====================================================

create table public.inventory_logs (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references public.products(id) on delete cascade,
  change_qty  integer not null,  -- positive = add, negative = subtract
  reason      text,
  reference_id uuid,             -- order_id or manual adjustment id
  created_by  uuid references public.users(id),
  created_at  timestamptz not null default now()
);

-- =====================================================
-- ORDERS
-- =====================================================

create sequence if not exists order_seq start 1;

create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique default ('JP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_seq')::text, 5, '0')),
  user_id         uuid references public.users(id) on delete set null,
  guest_email     text,
  guest_name      text,
  guest_phone     text,
  status          order_status not null default 'pending',
  subtotal        numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  shipping_fee    numeric(10,2) not null default 0,
  vat_amount      numeric(10,2) not null default 0,
  total_amount    numeric(10,2) not null,
  shipping_address jsonb,
  notes           text,
  coupon_code     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();

-- =====================================================
-- ORDER ITEMS
-- =====================================================

create table public.order_items (
  id               uuid primary key default uuid_generate_v4(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  product_name     text not null,  -- snapshot at order time
  product_sku      text,
  unit_price       numeric(10,2) not null,
  quantity         integer not null,
  total_price      numeric(10,2) not null,
  created_at       timestamptz not null default now()
);

-- =====================================================
-- PAYMENTS
-- =====================================================

create table public.payments (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  method          payment_method not null,
  status          payment_status not null default 'pending',
  amount          numeric(10,2) not null,
  slip_url        text,
  reference_code  text,
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- =====================================================
-- SHIPMENTS
-- =====================================================

create table public.shipments (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  carrier         text,
  tracking_number text,
  shipped_at      timestamptz,
  estimated_delivery timestamptz,
  delivered_at    timestamptz,
  created_at      timestamptz not null default now()
);

-- =====================================================
-- DOCUMENTS (Invoice, Receipt, Tax Invoice, Delivery Note)
-- =====================================================

create sequence if not exists inv_seq start 1;
create sequence if not exists rec_seq start 1;
create sequence if not exists tax_seq start 1;
create sequence if not exists dn_seq start 1;

create table public.documents (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  doc_type        document_type not null,
  doc_number      text not null unique,
  issued_at       timestamptz not null default now(),
  file_url        text,
  created_at      timestamptz not null default now()
);

-- =====================================================
-- COUPONS
-- =====================================================

create table public.coupons (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  description     text,
  discount_type   text not null check (discount_type in ('percent', 'fixed')),
  discount_value  numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  max_uses        integer,
  used_count      integer not null default 0,
  valid_from      timestamptz,
  valid_until     timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

alter table public.users enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;
alter table public.documents enable row level security;

-- Users: can read own profile, admin can read all
create policy "users_read_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Categories & Products: public read
create policy "categories_public_read" on public.categories
  for select using (true);

create policy "products_public_read" on public.products
  for select using (is_active = true);

create policy "product_images_public_read" on public.product_images
  for select using (true);

-- Orders: users see own orders
create policy "orders_read_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "order_items_read_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "payments_read_own" on public.payments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "shipments_read_own" on public.shipments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "documents_read_own" on public.documents
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "addresses_read_own" on public.addresses
  for select using (auth.uid() = user_id);

create policy "addresses_insert_own" on public.addresses
  for insert with check (auth.uid() = user_id);

create policy "addresses_update_own" on public.addresses
  for update using (auth.uid() = user_id);

create policy "addresses_delete_own" on public.addresses
  for delete using (auth.uid() = user_id);
