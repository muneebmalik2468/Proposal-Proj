-- Add category column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other';

-- Add comment for clarity
COMMENT ON COLUMN public.users.category IS 'Primary work category selected by user during signup';
