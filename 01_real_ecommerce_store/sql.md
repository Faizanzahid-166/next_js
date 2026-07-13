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

-- Enable Row Level Security (RLS) for Supabase security
ALTER TABLE "03_ecommerce_store_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "03_cart_items" ENABLE ROW LEVEL SECURITY;
