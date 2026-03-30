
-- Create pages table
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text,
  location text,
  avatar_url text,
  links jsonb DEFAULT '[]'::jsonb,
  social_icons jsonb DEFAULT '{}'::jsonb,
  theme text DEFAULT 'default',
  theme_options jsonb DEFAULT '{}'::jsonb,
  edit_token text UNIQUE NOT NULL,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create link_clicks table
CREATE TABLE public.link_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  link_index integer NOT NULL,
  link_url text NOT NULL,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Pages policies (public access for this no-auth app)
CREATE POLICY "public_read" ON public.pages FOR SELECT USING (true);
CREATE POLICY "public_insert" ON public.pages FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON public.pages FOR UPDATE USING (true);

-- Link clicks policies
CREATE POLICY "public_read" ON public.link_clicks FOR SELECT USING (true);
CREATE POLICY "public_insert" ON public.link_clicks FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for username lookups
CREATE INDEX idx_pages_username ON public.pages(username);
CREATE INDEX idx_pages_edit_token ON public.pages(edit_token);
CREATE INDEX idx_link_clicks_page_id ON public.link_clicks(page_id);
