// ============================================
// Jolly Pet — TypeScript Types
// ============================================

export type UserType = "retail" | "wholesale" | "admin";
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentMethod = "promptpay" | "bank_transfer" | "card";
export type PricingType = "retail" | "wholesale";
export type DocumentType = "invoice" | "receipt" | "tax_invoice" | "delivery_note";
export type Courier = "kerry" | "flash" | "other";

// --- User ---
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  tax_id: string | null;
  user_type: UserType;
  is_approved: boolean;
  created_at: string;
}

// --- Address ---
export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  recipient: string;
  phone: string;
  address_line: string;
  sub_district: string;
  district: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

// --- Category ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

// --- Product ---
export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description: string | null;
  sku?: string | null;
  barcode?: string | null;
  retail_price: number;
  wholesale_price: number | null;
  cost_price?: number | null;
  min_wholesale_qty?: number;
  weight_grams: number | null;
  stock_qty: number;
  low_stock_alert: number;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id?: string;
  product_id?: string;
  name: string;                        // "รสนม", "รสเนื้อย่าง", "360ml" ฯลฯ
  sku?: string | null;
  barcode?: string | null;
  retail_price?: number | null;        // null = ใช้ราคาจาก product
  wholesale_price?: number | null;     // null = ใช้ราคาจาก product
  stock_qty: number;
  image_url?: string | null;
  sort_order: number;
  is_active?: boolean;
}

// --- Cart ---
export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: number; // ราคาที่ใช้จริง (retail หรือ wholesale)
}

// --- Order ---
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  vat_amount: number;
  total_amount: number;
  payment_method: PaymentMethod | null;
  pricing_type: PricingType;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
  payment?: Payment;
  shipment?: Shipment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

// --- Payment ---
export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  amount: number;
  status: "pending" | "processing" | "success" | "failed" | "refunded";
  slip_url: string | null;
  paid_at: string | null;
}

// --- Shipment ---
export interface Shipment {
  id: string;
  order_id: string;
  courier: Courier;
  tracking_number: string | null;
  tracking_url: string | null;
  status: "pending" | "picked_up" | "in_transit" | "delivered" | "failed";
  shipped_at: string | null;
  delivered_at: string | null;
}

// --- Document ---
export interface Document {
  id: string;
  order_id: string;
  type: DocumentType;
  document_number: string;
  pdf_url: string | null;
  issued_at: string;
}

// --- API Responses ---
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
