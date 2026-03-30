// ============================================================
// Database types for the Underated ecommerce store
// ============================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: "li-ning" | "anta";
  description: string | null;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "ready_for_collection"
  | "collected"
  | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  total_amount: number;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number;
}

export interface SiteSetting {
  key: string;
  value: string;
}

// ============================================================
// Cart types (client-side)
// ============================================================

export interface CartItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

// ============================================================
// Form schemas
// ============================================================

export interface ProductFormData {
  name: string;
  brand: "li-ning" | "anta";
  description: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  variants: { size: string; stock: number }[];
}

export interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}
