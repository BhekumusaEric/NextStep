-- Huddles & Notifications Migration
-- Run in Supabase SQL Editor

-- ── Huddles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.huddles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  capacity int DEFAULT 20,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','ended')),
  created_at timestamptz DEFAULT now()
);

-- Huddle RSVPs
CREATE TABLE IF NOT EXISTS public.huddle_rsvps (
  huddle_id uuid REFERENCES public.huddles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (huddle_id, user_id)
);

-- Huddle group chat
CREATE TABLE IF NOT EXISTS public.huddle_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  huddle_id uuid REFERENCES public.huddles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ── Notifications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('mentorship_accepted','mentorship_declined','huddle_rsvp','huddle_live','new_answer','new_comment')),
  title text NOT NULL,
  body text,
  read boolean DEFAULT false,
  reference_id uuid,   -- points to the relevant record
  created_at timestamptz DEFAULT now()
);

-- ── RLS ───────────────────────────────────────────────────────
ALTER TABLE public.huddles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.huddle_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.huddle_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Huddles viewable by everyone" ON public.huddles FOR SELECT USING (true);
CREATE POLICY "Mentors can create huddles" ON public.huddles FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own huddles" ON public.huddles FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete own huddles" ON public.huddles FOR DELETE USING (auth.uid() = host_id);

CREATE POLICY "RSVPs viewable by everyone" ON public.huddle_rsvps FOR SELECT USING (true);
CREATE POLICY "Users manage own RSVP" ON public.huddle_rsvps FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Huddle messages viewable by everyone" ON public.huddle_messages FOR SELECT USING (true);
CREATE POLICY "RSVP'd users can send messages" ON public.huddle_messages FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (
    auth.uid() IN (SELECT user_id FROM public.huddle_rsvps WHERE huddle_id = huddle_messages.huddle_id)
    OR auth.uid() IN (SELECT host_id FROM public.huddles WHERE id = huddle_messages.huddle_id)
  )
);
CREATE POLICY "Users can delete own huddle messages" ON public.huddle_messages FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- ── Realtime ──────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.huddle_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
