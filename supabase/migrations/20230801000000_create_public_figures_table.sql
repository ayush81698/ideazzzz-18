
-- Create public_figures table if it doesn't exist
CREATE TABLE IF NOT EXISTS public_figures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  imageurl TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the RPC function to be called from the frontend
CREATE OR REPLACE FUNCTION create_public_figures_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure the table exists
  CREATE TABLE IF NOT EXISTS public_figures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    imageurl TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
  );
END;
$$;

-- Set up row-level security policies
ALTER TABLE public_figures ENABLE ROW LEVEL SECURITY;

-- Policy for admins (they can do everything)
CREATE POLICY admin_policy ON public_figures
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- Policy for read-only access for all authenticated users
CREATE POLICY read_policy ON public_figures
  FOR SELECT
  USING (true);
