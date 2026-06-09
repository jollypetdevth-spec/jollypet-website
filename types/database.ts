// Auto-generated Supabase type stubs
// ใช้ `npx supabase gen types typescript` เพื่อ generate จาก schema จริง

export interface Database {
  public: {
    Tables: {
      users: { Row: any; Insert: any; Update: any };
      addresses: { Row: any; Insert: any; Update: any };
      categories: { Row: any; Insert: any; Update: any };
      products: { Row: any; Insert: any; Update: any };
      product_images: { Row: any; Insert: any; Update: any };
      inventory_logs: { Row: any; Insert: any; Update: any };
      orders: { Row: any; Insert: any; Update: any };
      order_items: { Row: any; Insert: any; Update: any };
      payments: { Row: any; Insert: any; Update: any };
      shipments: { Row: any; Insert: any; Update: any };
      documents: { Row: any; Insert: any; Update: any };
      coupons: { Row: any; Insert: any; Update: any };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
