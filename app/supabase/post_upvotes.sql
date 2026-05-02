-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.post_upvotes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  unique (post_id, user_id)
);

alter table public.post_upvotes enable row level security;

create policy "Users manage own upvotes" on public.post_upvotes
  for all using (auth.uid() = user_id);
