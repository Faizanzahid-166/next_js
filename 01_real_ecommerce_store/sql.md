-- Enable UUID extension (Supabase usually has this enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Table: 03_ecommerce_store_products
CREATE TABLE "03_ecommerce_store_products" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NULL,
    price NUMERIC NOT NULL,
    stock INT4 NOT NULL,
    description TEXT NULL,
    image_url TEXT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT NOW(),
    product_no INT4 UNIQUE NOT NULL
);

-- Create Table: 03_orders
CREATE TABLE "03_orders" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PLACED',
    total_amount NUMERIC NOT NULL,
    sub_total NUMERIC NOT NULL DEFAULT 0,
    delivery_charge NUMERIC NOT NULL DEFAULT 300,
    payment_method TEXT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    payment_channel TEXT NULL,
    transaction_id TEXT NULL,
    proof_image TEXT NULL,
    paid_at TIMESTAMPTZ NULL,
    shipping_full_name TEXT NULL,
    shipping_phone TEXT NULL,
    shipping_address TEXT NULL,
    shipping_city TEXT NULL,
    shipping_country TEXT NULL,
    shipping_postal_code TEXT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT NOW()
);

-- Create Table: 03_carts
CREATE TABLE "03_carts" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT NOW()
);

-- Create Table: 03_cart_items
CREATE TABLE "03_cart_items" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NULL REFERENCES "03_carts"(id) ON DELETE CASCADE,
    product_id UUID NULL REFERENCES "03_ecommerce_store_products"(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    quantity INT4 NOT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT NOW()
);

-- Create Table: 03_order_items
CREATE TABLE "03_order_items" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NULL REFERENCES "03_orders"(id) ON DELETE CASCADE,
    product_id UUID NULL REFERENCES "03_ecommerce_store_products"(id) ON DELETE SET NULL,
    quantity INT4 NOT NULL,
    price_at_purchase NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for Supabase security
ALTER TABLE "03_ecommerce_store_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_cart_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_order_items" ENABLE ROW LEVEL SECURITY;
