-- CLEAN SUPABASE MIGRATION (ALL-IN-ONE)

-- STEP 1: ENUM
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
    CREATE TYPE plan_type AS ENUM ('free', 'basic', 'pro', 'promax');
  END IF;
END $$;


-- STEP 2: USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,

  plan plan_type NOT NULL DEFAULT 'free',
  credits integer NOT NULL DEFAULT 5,
  credits_limit integer DEFAULT 5,
  plan_since timestamptz DEFAULT now(),
  plan_expires timestamptz,

  usage_count integer NOT NULL DEFAULT 0,
  usage_reset_at date NOT NULL DEFAULT CURRENT_DATE,

  is_admin boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- STEP 3: PLAN CHANGE TRIGGER
CREATE OR REPLACE FUNCTION public.update_credits_on_plan_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.plan IS DISTINCT FROM NEW.plan THEN
    NEW.plan_since := now();

    CASE NEW.plan
      WHEN 'free' THEN
        NEW.credits := 5;
        NEW.credits_limit := 5;
        NEW.plan_expires := NULL;

      WHEN 'basic' THEN
        NEW.credits := 15;
        NEW.credits_limit := 15;
        NEW.plan_expires := now() + interval '1 month';

      WHEN 'pro' THEN
        NEW.credits := 200;
        NEW.credits_limit := 200;
        NEW.plan_expires := now() + interval '1 month';

      WHEN 'promax' THEN
        NEW.credits := 999999;
        NEW.credits_limit := NULL;
        NEW.plan_expires := now() + interval '1 month';
    END CASE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_plan_change ON public.users;

CREATE TRIGGER on_plan_change
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_credits_on_plan_change();


-- STEP 4: AUTO CREATE USER PROFILE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    plan,
    credits,
    credits_limit,
    plan_since
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    5,
    5,
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- STEP 5: RESET MONTHLY CREDITS
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    credits = CASE plan
      WHEN 'free' THEN 5
      WHEN 'basic' THEN 15
      WHEN 'pro' THEN 200
      WHEN 'promax' THEN 999999
    END,
    credits_limit = CASE plan
      WHEN 'promax' THEN NULL
      WHEN 'free' THEN 5
      WHEN 'basic' THEN 15
      WHEN 'pro' THEN 200
    END,
    usage_reset_at = CURRENT_DATE
  WHERE usage_reset_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;


-- STEP 6: PLAN EXPIRY HANDLER
CREATE OR REPLACE FUNCTION public.check_and_downgrade_expired_plans()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    plan = 'free',
    credits = 5,
    credits_limit = 5,
    plan_since = now(),
    plan_expires = NULL
  WHERE 
    plan IN ('basic', 'pro', 'promax')
    AND plan_expires IS NOT NULL
    AND plan_expires < now();
END;
$$ LANGUAGE plpgsql;


-- STEP 7: CREDIT DEDUCTION
CREATE OR REPLACE FUNCTION public.deduct_generation_credit(user_id uuid)
RETURNS boolean AS $$
DECLARE
  user_record public.users%ROWTYPE;
BEGIN
  PERFORM public.check_and_downgrade_expired_plans();
  PERFORM public.reset_monthly_credits();

  SELECT * INTO user_record
  FROM public.users
  WHERE id = user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF user_record.plan = 'promax' THEN
    RETURN true;
  END IF;

  IF user_record.credits <= 0 THEN
    RETURN false;
  END IF;

  UPDATE public.users
  SET credits = credits - 1
  WHERE id = user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;


-- STEP 8: GET USER CREDITS
CREATE OR REPLACE FUNCTION public.get_user_credits(user_id uuid)
RETURNS TABLE (
  plan text,
  credits integer,
  credits_limit integer,
  plan_expires timestamptz,
  is_expired boolean
) AS $$
BEGIN
  PERFORM public.check_and_downgrade_expired_plans();
  PERFORM public.reset_monthly_credits();

  RETURN QUERY
  SELECT 
    u.plan::text,
    u.credits,
    u.credits_limit,
    u.plan_expires,
    (u.plan_expires IS NOT NULL AND u.plan_expires < now())
  FROM public.users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;
