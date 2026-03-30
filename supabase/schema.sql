-- ============================================================
-- Underated Ecommerce — Supabase SQL Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- ============================================================

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('li-ning', 'anta')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product variants (one row per size)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, size)
);

-- Product images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment','paid','ready_for_collection','collected','cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Site settings (key-value store for collection info, etc.)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_images_product ON product_images(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin full access to products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product variants: public read, admin write
CREATE POLICY "Public can view variants" ON product_variants
  FOR SELECT USING (true);
CREATE POLICY "Admin full access to variants" ON product_variants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product images: public read, admin write
CREATE POLICY "Public can view images" ON product_images
  FOR SELECT USING (true);
CREATE POLICY "Admin full access to images" ON product_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: admin only
CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order items: admin only
CREATE POLICY "Admin full access to order items" ON order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site settings: public read, admin write
CREATE POLICY "Public can view settings" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin full access to settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('collection_address', 'To be configured'),
  ('collection_hours', 'To be configured'),
  ('collection_instructions', 'Please bring your order confirmation email and a valid ID for verification.');

-- Supabase Storage: create bucket for product images
-- (Run this in Supabase Dashboard > Storage > New Bucket)
-- Bucket name: product-images
-- Public: Yes

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
