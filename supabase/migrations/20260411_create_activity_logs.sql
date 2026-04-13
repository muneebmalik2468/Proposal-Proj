-- Create activity_logs table for tracking user activity
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tool_type text NOT NULL CHECK (tool_type IN ('upwork', 'linkedin-inmail', 'linkedin-connection', 'cold-email')),
  action_type text NOT NULL DEFAULT 'generate' CHECK (action_type IN ('generate', 'copy', 'view')),
  title text,
  style text,
  prompt_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_tool_type ON public.activity_logs(tool_type);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON public.activity_logs(user_id, created_at DESC);

-- Create view for monthly activity summary
CREATE OR REPLACE VIEW public.monthly_activity_summary AS
SELECT
  user_id,
  DATE_TRUNC('month', created_at)::date AS month,
  tool_type,
  COUNT(*) AS count,
  COUNT(CASE WHEN action_type = 'generate' THEN 1 END) AS generations,
  COUNT(CASE WHEN action_type = 'copy' THEN 1 END) AS copies,
  COUNT(CASE WHEN action_type = 'view' THEN 1 END) AS views
FROM public.activity_logs
GROUP BY user_id, DATE_TRUNC('month', created_at), tool_type;

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_logs
-- Allow authenticated users to SELECT their own activity logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow authenticated users to INSERT their own activity logs
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON public.activity_logs TO authenticated;
GRANT INSERT ON public.activity_logs TO authenticated;
GRANT SELECT ON public.monthly_activity_summary TO authenticated;
