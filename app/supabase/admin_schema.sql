-- Admin schema additions
-- Run in Supabase SQL Editor

-- Role on profiles (admin | user)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'user'
    CHECK (role IN ('user', 'admin'));

-- Verified flag on mentors
ALTER TABLE public.mentors
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Reports table for flagged posts
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  reason text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can report posts"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Admins can read/update everything via service role (bypasses RLS)
