-- NextStep Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- Users profile (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  university text,
  bio text,
  skills text[],
  career_interests text[],
  avatar_url text,
  github_url text,
  linkedin_url text,
  created_at timestamptz default now()
);

-- Opportunities
create table if not exists public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  organization text not null,
  type text not null check (type in ('internship','learnership','graduate','scholarship','event','bootcamp')),
  deadline date,
  location text,
  eligibility text,
  link text,
  tags text[],
  created_at timestamptz default now()
);

-- Saved opportunities
create table if not exists public.saved_opportunities (
  user_id uuid references public.profiles(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  primary key (user_id, opportunity_id)
);

-- Forum posts
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  category text check (category in ('question','opportunity','interview','career_win','advice')),
  upvotes int default 0,
  created_at timestamptz default now()
);

-- Comments
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Mentors
create table if not exists public.mentors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  industry text,
  experience_years int,
  skills text[],
  availability text,
  created_at timestamptz default now()
);

-- Mentorship requests
create table if not exists public.mentorship_requests (
  id uuid default gen_random_uuid() primary key,
  mentee_id uuid references public.profiles(id) on delete cascade,
  mentor_id uuid references public.mentors(id) on delete cascade,
  message text,
  status text default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.mentors enable row level security;
alter table public.mentorship_requests enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Opportunities are viewable by everyone" on public.opportunities for select using (true);

create policy "Users manage own saved opportunities" on public.saved_opportunities for all using (auth.uid() = user_id);

create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Authenticated users can create posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts" on public.posts for update using (auth.uid() = user_id);

create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Authenticated users can comment" on public.comments for insert with check (auth.uid() = user_id);

create policy "Mentors are viewable by everyone" on public.mentors for select using (true);
create policy "Users manage own mentor profile" on public.mentors for all using (auth.uid() = user_id);

create policy "Users manage own mentorship requests" on public.mentorship_requests for all using (
  auth.uid() = mentee_id or
  auth.uid() = (select user_id from public.mentors where id = mentor_id)
);
