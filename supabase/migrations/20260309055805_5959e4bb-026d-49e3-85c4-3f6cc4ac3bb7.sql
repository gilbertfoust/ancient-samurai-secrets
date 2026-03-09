
ALTER TABLE public.acupressure_points 
ADD COLUMN IF NOT EXISTS meridian text,
ADD COLUMN IF NOT EXISTS chinese_name text,
ADD COLUMN IF NOT EXISTS alphanumeric_code text,
ADD COLUMN IF NOT EXISTS anatomical_location text,
ADD COLUMN IF NOT EXISTS notes text;
