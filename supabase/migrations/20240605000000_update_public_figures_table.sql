
-- Add subtitle, description, and order columns to public_figures table
ALTER TABLE IF EXISTS public_figures
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Update existing rows to have order values
WITH indexed_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as row_index
  FROM public_figures
)
UPDATE public_figures
SET "order" = indexed_rows.row_index
FROM indexed_rows
WHERE public_figures.id = indexed_rows.id;
