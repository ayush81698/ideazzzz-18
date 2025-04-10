
-- Add the usdz_url column to products table for iOS AR support
ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS usdz_url text;

COMMENT ON COLUMN public.products.usdz_url IS 'URL to the USDZ format 3D model for iOS AR viewing';
