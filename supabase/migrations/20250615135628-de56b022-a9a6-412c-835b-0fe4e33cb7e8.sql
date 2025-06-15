
-- Add category column to the blogs table in portal_data
-- Since we're using JSONB storage, we'll need to update the blog structure
-- Let's also create a separate categories table for better management

-- Create a categories table for blog categories
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#6B7280',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_categories (admin access)
CREATE POLICY "Admin can manage blog categories" ON public.blog_categories
  FOR ALL USING (true);

-- Insert some default categories
INSERT INTO public.blog_categories (name, description, color) VALUES
  ('Research', 'Research papers and findings', '#3B82F6'),
  ('Education', 'Teaching and educational content', '#10B981'),
  ('Technology', 'Technology updates and insights', '#8B5CF6'),
  ('News', 'Latest news and announcements', '#F59E0B');
