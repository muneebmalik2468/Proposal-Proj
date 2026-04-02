-- Step 5: Usage limit system (free users: 5/month)
-- Ensures required usage fields exist and provides monthly reset function.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS usage_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS usage_reset_at date NOT NULL DEFAULT CURRENT_DATE;

CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void AS $$
  UPDATE public.users
  SET usage_count = 0,
      usage_reset_at = CURRENT_DATE
  WHERE usage_reset_at < date_trunc('month', CURRENT_DATE)::date;
$$ LANGUAGE sql;

