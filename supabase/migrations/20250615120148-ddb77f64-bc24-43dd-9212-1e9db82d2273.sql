
-- Create tables for portal data
CREATE TABLE public.portal_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  title text,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
  created_at timestamp with time zone DEFAULT now()
);

-- Create table for job applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opening_id text NOT NULL,
  opening_title text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  qualifications text NOT NULL,
  portfolio_url text,
  resume_url text,
  resume_file_name text,
  resume_path text,
  application_date timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected'))
);

-- Create table for theme configurations
CREATE TABLE public.theme_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id text NOT NULL,
  banner_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, theme_id)
);

-- Enable Row Level Security
ALTER TABLE public.portal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portal_data (admin access)
CREATE POLICY "Admin can manage portal data" ON public.portal_data
  FOR ALL USING (true);

-- Create RLS policies for contact_messages (public can insert, admin can read)
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read contact messages" ON public.contact_messages
  FOR SELECT USING (true);

CREATE POLICY "Admin can update contact messages" ON public.contact_messages
  FOR UPDATE USING (true);

CREATE POLICY "Admin can delete contact messages" ON public.contact_messages
  FOR DELETE USING (true);

-- Create RLS policies for applications (public can insert, admin can read)
CREATE POLICY "Anyone can insert applications" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read applications" ON public.applications
  FOR SELECT USING (true);

CREATE POLICY "Admin can update applications" ON public.applications
  FOR UPDATE USING (true);

-- Create RLS policies for theme_config (admin access)
CREATE POLICY "Admin can manage theme config" ON public.theme_config
  FOR ALL USING (true);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('portal-files', 'portal-files', true);

-- Create storage policies
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'portal-files');

CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portal-files');

CREATE POLICY "Admin can update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portal-files');

CREATE POLICY "Admin can delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'portal-files');
