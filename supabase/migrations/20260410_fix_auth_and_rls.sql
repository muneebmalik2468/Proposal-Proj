-- STEP 0: Drop existing policies first (before dropping function)
DROP POLICY IF EXISTS "Admin can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create security definer function to check admin status
-- This function bypasses RLS so it can be safely used in RLS policies
DROP FUNCTION IF EXISTS public.is_user_admin(user_id uuid);
CREATE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(is_admin, false) FROM public.users WHERE id = user_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;

-- STEP 1: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- STEP 2: Users can read ONLY their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- STEP 2b: Admin users can read all users
-- Uses the security definer function to check admin status without RLS recursion
CREATE POLICY "Admin can read all users"
ON public.users
FOR SELECT
USING (public.is_user_admin(auth.uid()));

-- STEP 3: Users can update ONLY their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- STEP 3b: Admin users can update all users
CREATE POLICY "Admins can update all users"
ON public.users
FOR UPDATE
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- STEP 4: Allow service role (backend) full access
-- (No policy needed — service role bypasses RLS automatically)

-- STEP 5: Indexes (optional but good)
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- STEP 6: Permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;