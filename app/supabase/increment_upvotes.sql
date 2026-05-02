-- Run in Supabase Dashboard → SQL Editor

create or replace function increment_upvotes(post_id uuid)
returns void as $$
  update public.posts set upvotes = upvotes + 1 where id = post_id;
$$ language sql security definer;
