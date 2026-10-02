-- ============================================================
-- Migration: Add guest checkout support to 03_orders table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add is_guest flag (defaults to FALSE for all existing orders)
ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS is_guest BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Add guest contact/shipping info columns (nullable — only used for guest orders)
ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS guest_name TEXT;

ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS guest_phone TEXT;

ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS guest_address TEXT;

ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS guest_city TEXT;

ALTER TABLE public."03_orders"
  ADD COLUMN IF NOT EXISTS guest_country TEXT;

-- 3. Make user_id nullable so guest orders can have NULL user_id
--    (If user_id currently has a NOT NULL constraint, alter it)
ALTER TABLE public."03_orders"
  ALTER COLUMN user_id DROP NOT NULL;

-- 4. (Optional) Add an index on is_guest for faster admin filtering
CREATE INDEX IF NOT EXISTS idx_03_orders_is_guest ON public."03_orders"(is_guest);

-- ============================================================
-- Verify the changes
-- ============================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = '03_orders'
ORDER BY ordinal_position;
