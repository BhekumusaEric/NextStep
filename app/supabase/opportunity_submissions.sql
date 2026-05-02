-- Migration: user-submitted opportunities with admin approval
-- Run this in Supabase SQL Editor

-- Add status and submitted_by to opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES public.profiles(id);

-- Existing seeded opportunities stay approved (default applied above)

-- Feed only shows approved opportunities
DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON public.opportunities;
CREATE POLICY "Approved opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (status = 'approved');

-- Authenticated users can submit opportunities (they go in as pending)
CREATE POLICY "Authenticated users can submit opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

-- Users can view their own pending/rejected submissions
CREATE POLICY "Users can view own submissions"
  ON public.opportunities FOR SELECT
  USING (auth.uid() = submitted_by);
