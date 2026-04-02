-- Step 2 auth/user profile schema for APPNAME
-- Required fields: id, email, credits (default 5), created_at
-- Includes existing MVP fields used by backend routes.

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  credits integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text,
  is_pro boolean DEFAULT false,
  pro_since timestamptz,
  pro_expires timestamptz,
  usage_count integer DEFAULT 0,
  usage_reset_at date DEFAULT CURRENT_DATE
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS credits integer NOT NULL DEFAULT 5;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, credits, full_name)
  VALUES (NEW.id, NEW.email, 5, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

