-- Copy and paste this into your Supabase SQL Editor and click "Run"

-- 1. Add full_name to tracking profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;

-- 2. Add overall_score to track the calculated score in the database
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS overall_score numeric;

-- 3. Create a view that automatically calculates live totals for completed assessments
CREATE OR REPLACE VIEW public.global_assessment_totals AS
SELECT 
  type as assessment_type,
  COUNT(*) as total_completions,
  ROUND(AVG(overall_score), 1) as average_score
FROM public.assessments
WHERE status = 'completed' AND overall_score IS NOT NULL
GROUP BY type;

-- Grant access to the view so the public can read the aggregated stats
GRANT SELECT ON public.global_assessment_totals TO anon, authenticated;
