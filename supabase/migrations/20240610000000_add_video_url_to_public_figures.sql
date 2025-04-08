
-- Add video_url column to public_figures table
ALTER TABLE IF EXISTS public_figures
ADD COLUMN IF NOT EXISTS video_url TEXT;
