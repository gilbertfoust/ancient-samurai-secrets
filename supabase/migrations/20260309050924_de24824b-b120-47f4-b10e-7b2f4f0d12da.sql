
ALTER TABLE public.herbs ADD COLUMN IF NOT EXISTS image_url text;

INSERT INTO storage.buckets (id, name, public) VALUES ('herb-images', 'herb-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read herb-images" ON storage.objects FOR SELECT USING (bucket_id = 'herb-images');
CREATE POLICY "Service role insert herb-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'herb-images');
