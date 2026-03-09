
-- ============================================================
-- HEALTH & WELLNESS BIBLE — FULL DATABASE SCHEMA
-- ============================================================

-- Evidence label enum
CREATE TYPE public.evidence_label AS ENUM ('Traditional', 'Observed', 'Supported', 'Speculative');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- 1. SOURCES
-- ============================================================
CREATE TABLE public.sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  year INTEGER,
  citation TEXT,
  file_path TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);

-- ============================================================
-- 2. HERBS
-- ============================================================
CREATE TABLE public.herbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latin_name TEXT,
  common_name TEXT NOT NULL,
  chinese_name TEXT,
  synonyms TEXT[],
  description TEXT,
  uses TEXT,
  cautions TEXT,
  evidence_label public.evidence_label NOT NULL DEFAULT 'Traditional',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.herbs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read herbs" ON public.herbs FOR SELECT USING (true);
CREATE TRIGGER update_herbs_updated_at BEFORE UPDATE ON public.herbs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 3. RECIPES
-- ============================================================
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  purpose TEXT,
  ingredients JSONB,
  method TEXT,
  storage TEXT,
  cautions TEXT,
  category TEXT DEFAULT 'food',
  evidence_label public.evidence_label NOT NULL DEFAULT 'Traditional',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read recipes" ON public.recipes FOR SELECT USING (true);
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. REMEDIES
-- ============================================================
CREATE TABLE public.remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition TEXT NOT NULL,
  method TEXT,
  materials JSONB,
  steps TEXT,
  cautions TEXT,
  evidence_label public.evidence_label NOT NULL DEFAULT 'Traditional',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read remedies" ON public.remedies FOR SELECT USING (true);
CREATE TRIGGER update_remedies_updated_at BEFORE UPDATE ON public.remedies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. OILS
-- ============================================================
CREATE TABLE public.oils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  condition TEXT,
  application_methods TEXT,
  dilutions TEXT,
  cautions TEXT,
  evidence_label public.evidence_label NOT NULL DEFAULT 'Traditional',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.oils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read oils" ON public.oils FOR SELECT USING (true);
CREATE TRIGGER update_oils_updated_at BEFORE UPDATE ON public.oils FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. ACUPRESSURE POINTS
-- ============================================================
CREATE TABLE public.acupressure_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  point_name TEXT NOT NULL,
  condition TEXT,
  location_description TEXT,
  steps TEXT,
  cautions TEXT,
  evidence_label public.evidence_label NOT NULL DEFAULT 'Traditional',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.acupressure_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read acupressure" ON public.acupressure_points FOR SELECT USING (true);
CREATE TRIGGER update_acupressure_updated_at BEFORE UPDATE ON public.acupressure_points FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. CHARTS
-- ============================================================
CREATE TABLE public.charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  data JSONB,
  description TEXT,
  effective_date DATE,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read charts" ON public.charts FOR SELECT USING (true);
CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON public.charts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 8. NARRATIVES
-- ============================================================
CREATE TABLE public.narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  related_topic TEXT,
  evidence_label public.evidence_label NOT NULL DEFAULT 'Observed',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.narratives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read narratives" ON public.narratives FOR SELECT USING (true);
CREATE TRIGGER update_narratives_updated_at BEFORE UPDATE ON public.narratives FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9. GUIDELINES
-- ============================================================
CREATE TABLE public.guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.guidelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read guidelines" ON public.guidelines FOR SELECT USING (true);
CREATE TRIGGER update_guidelines_updated_at BEFORE UPDATE ON public.guidelines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 10. FOOD PROMOTION CHARTS
-- ============================================================
CREATE TABLE public.food_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition TEXT NOT NULL,
  nutrient_focus TEXT,
  example_foods TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.food_promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read food_promotions" ON public.food_promotions FOR SELECT USING (true);

-- ============================================================
-- 11. DIET BY BLOOD TYPE
-- ============================================================
CREATE TABLE public.diet_blood_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_type TEXT NOT NULL,
  category TEXT NOT NULL,
  foods_allowed TEXT,
  foods_to_limit TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.diet_blood_type ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read diet_blood_type" ON public.diet_blood_type FOR SELECT USING (true);

-- ============================================================
-- 12. DAILY INTAKE GUIDELINES
-- ============================================================
CREATE TABLE public.daily_intake_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL,
  recommended_range TEXT NOT NULL,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.daily_intake_guidelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read daily_intake" ON public.daily_intake_guidelines FOR SELECT USING (true);

-- ============================================================
-- 13. FIRST AID ITEMS
-- ============================================================
CREATE TABLE public.first_aid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  purpose TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.first_aid_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read first_aid_items" ON public.first_aid_items FOR SELECT USING (true);

-- ============================================================
-- 14. POISON RESPONSE STEPS
-- ============================================================
CREATE TABLE public.poison_response_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_order INTEGER NOT NULL,
  description TEXT NOT NULL,
  poison_type TEXT DEFAULT 'ingested',
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.poison_response_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read poison_steps" ON public.poison_response_steps FOR SELECT USING (true);

-- ============================================================
-- 15. SYMPTOM DIFFERENTIATION
-- ============================================================
CREATE TABLE public.symptom_differentiation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom TEXT NOT NULL,
  cold_severity TEXT,
  flu_severity TEXT,
  h1n1_severity TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.symptom_differentiation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read symptom_diff" ON public.symptom_differentiation FOR SELECT USING (true);

-- ============================================================
-- 16. EXAM SCHEDULES
-- ============================================================
CREATE TABLE public.exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_range TEXT NOT NULL,
  gender TEXT,
  exam_name TEXT NOT NULL,
  frequency TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exam_schedules" ON public.exam_schedules FOR SELECT USING (true);

-- ============================================================
-- 17. VACCINATION SCHEDULES
-- ============================================================
CREATE TABLE public.vaccination_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaccine_name TEXT NOT NULL,
  age_range TEXT NOT NULL,
  dosage_schedule TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vaccination_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vaccination_schedules" ON public.vaccination_schedules FOR SELECT USING (true);

-- ============================================================
-- 18. MEDICATIONS
-- ============================================================
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  uses TEXT,
  typical_dose TEXT,
  cautions TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read medications" ON public.medications FOR SELECT USING (true);

-- ============================================================
-- 19. PILL IDENTIFICATION
-- ============================================================
CREATE TABLE public.pill_identification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name TEXT NOT NULL,
  color TEXT,
  shape TEXT,
  inscription TEXT,
  notes TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pill_identification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pill_id" ON public.pill_identification FOR SELECT USING (true);

-- ============================================================
-- 20. MNEMONICS
-- ============================================================
CREATE TABLE public.mnemonics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lyrics TEXT,
  topic TEXT,
  source_id TEXT REFERENCES public.sources(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mnemonics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mnemonics" ON public.mnemonics FOR SELECT USING (true);

-- ============================================================
-- JUNCTION TABLES
-- ============================================================

-- Recipe <-> Remedy
CREATE TABLE public.recipe_remedies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  UNIQUE(recipe_id, remedy_id)
);
ALTER TABLE public.recipe_remedies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read recipe_remedies" ON public.recipe_remedies FOR SELECT USING (true);

-- Remedy <-> Herb
CREATE TABLE public.remedy_herbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  herb_id UUID NOT NULL REFERENCES public.herbs(id) ON DELETE CASCADE,
  UNIQUE(remedy_id, herb_id)
);
ALTER TABLE public.remedy_herbs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read remedy_herbs" ON public.remedy_herbs FOR SELECT USING (true);

-- Remedy <-> Oil
CREATE TABLE public.remedy_oils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  oil_id UUID NOT NULL REFERENCES public.oils(id) ON DELETE CASCADE,
  UNIQUE(remedy_id, oil_id)
);
ALTER TABLE public.remedy_oils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read remedy_oils" ON public.remedy_oils FOR SELECT USING (true);

-- Remedy <-> Acupressure
CREATE TABLE public.remedy_acupressure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remedy_id UUID NOT NULL REFERENCES public.remedies(id) ON DELETE CASCADE,
  acupressure_point_id UUID NOT NULL REFERENCES public.acupressure_points(id) ON DELETE CASCADE,
  UNIQUE(remedy_id, acupressure_point_id)
);
ALTER TABLE public.remedy_acupressure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read remedy_acupressure" ON public.remedy_acupressure FOR SELECT USING (true);

-- ============================================================
-- INDEXES for search performance
-- ============================================================
CREATE INDEX idx_recipes_title ON public.recipes USING GIN (to_tsvector('english', title));
CREATE INDEX idx_herbs_common_name ON public.herbs USING GIN (to_tsvector('english', common_name));
CREATE INDEX idx_remedies_condition ON public.remedies USING GIN (to_tsvector('english', condition));
CREATE INDEX idx_oils_name ON public.oils USING GIN (to_tsvector('english', name));
CREATE INDEX idx_acupressure_condition ON public.acupressure_points USING GIN (to_tsvector('english', COALESCE(condition, '')));
CREATE INDEX idx_recipes_category ON public.recipes(category);
CREATE INDEX idx_charts_category ON public.charts(category);
CREATE INDEX idx_guidelines_category ON public.guidelines(category);
