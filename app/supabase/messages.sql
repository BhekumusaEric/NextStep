-- Messages table for mentor/mentee chat
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only participants of the mentorship request can read/send messages
CREATE POLICY "Participants can read messages"
  ON public.messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT mentee_id FROM public.mentorship_requests WHERE id = request_id
      UNION
      SELECT profiles.id FROM public.mentors
        JOIN public.profiles ON profiles.id = mentors.user_id
        JOIN public.mentorship_requests ON mentorship_requests.mentor_id = mentors.id
        WHERE mentorship_requests.id = request_id
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT mentee_id FROM public.mentorship_requests WHERE id = request_id
      UNION
      SELECT profiles.id FROM public.mentors
        JOIN public.profiles ON profiles.id = mentors.user_id
        JOIN public.mentorship_requests ON mentorship_requests.mentor_id = mentors.id
        WHERE mentorship_requests.id = request_id
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
