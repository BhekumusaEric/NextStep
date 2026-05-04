-- Journey Migration — run in Supabase SQL Editor

-- Add journey fields to profiles
alter table public.profiles
  add column if not exists background text check (background in ('student','graduate','switcher','beginner')),
  add column if not exists career_path text,
  add column if not exists journey_stage int default 1 check (journey_stage between 1 and 7),
  add column if not exists goal text check (goal in ('internship','fulltime','freelance','learning'));

-- Career paths
create table if not exists public.career_paths (
  id text primary key,
  title text not null,
  description text,
  icon text
);

-- Roadmap steps
create table if not exists public.roadmap_steps (
  id uuid default gen_random_uuid() primary key,
  career_path_id text references public.career_paths(id) on delete cascade,
  title text not null,
  resource_url text,
  step_order int not null,
  estimated_days int default 7
);

-- User progress
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  step_id uuid references public.roadmap_steps(id) on delete cascade,
  completed boolean default false,
  completed_at timestamptz,
  unique (user_id, step_id)
);

-- RLS
alter table public.career_paths enable row level security;
alter table public.roadmap_steps enable row level security;
alter table public.user_progress enable row level security;

create policy "Career paths viewable by everyone" on public.career_paths for select using (true);
create policy "Roadmap steps viewable by everyone" on public.roadmap_steps for select using (true);
create policy "Users manage own progress" on public.user_progress for all using (auth.uid() = user_id);

-- Seed career paths
insert into public.career_paths (id, title, description, icon) values
  ('frontend_dev',    'Frontend Developer',   'Build web and mobile interfaces', '💻'),
  ('data_analyst',    'Data Analyst',          'Turn data into decisions',        '📊'),
  ('ui_ux_designer',  'UI/UX Designer',        'Design experiences people love',  '🎨'),
  ('backend_dev',     'Backend Developer',     'Build APIs and server systems',   '⚙️'),
  ('product_manager', 'Product Manager',       'Lead products from idea to launch','🚀'),
  ('cybersecurity',   'Cybersecurity Analyst', 'Protect systems and data',        '🔒'),
  ('digital_marketing','Digital Marketer',     'Grow brands through digital channels','📱')
on conflict (id) do nothing;

-- Seed roadmap steps for data_analyst
insert into public.roadmap_steps (career_path_id, title, resource_url, step_order, estimated_days) values
  ('data_analyst', 'Learn Excel / Google Sheets', 'https://www.coursera.org/learn/excel-basics-data-analysis-ibm', 1, 7),
  ('data_analyst', 'Learn SQL basics',             'https://www.sqlcourse.com',                                      2, 14),
  ('data_analyst', 'Learn Python basics',          'https://www.kaggle.com/learn/python',                            3, 21),
  ('data_analyst', 'Build a portfolio project',    null,                                                             4, 14),
  ('data_analyst', 'Get a certificate',            'https://www.coursera.org/professional-certificates/google-data-analytics', 5, 30),
  ('data_analyst', 'Apply to learnerships',        null,                                                             6, 7)
on conflict do nothing;

-- Seed roadmap steps for frontend_dev
insert into public.roadmap_steps (career_path_id, title, resource_url, step_order, estimated_days) values
  ('frontend_dev', 'Learn HTML & CSS',        'https://www.freecodecamp.org/learn/responsive-web-design/', 1, 14),
  ('frontend_dev', 'Learn JavaScript basics', 'https://javascript.info',                                   2, 21),
  ('frontend_dev', 'Learn React',             'https://react.dev/learn',                                   3, 21),
  ('frontend_dev', 'Build 2 portfolio projects', null,                                                     4, 21),
  ('frontend_dev', 'Learn Git & GitHub',      'https://www.theodinproject.com/lessons/foundations-git-basics', 5, 7),
  ('frontend_dev', 'Apply to internships',    null,                                                         6, 7)
on conflict do nothing;

-- Seed roadmap steps for ui_ux_designer
insert into public.roadmap_steps (career_path_id, title, resource_url, step_order, estimated_days) values
  ('ui_ux_designer', 'Learn design fundamentals',  'https://www.coursera.org/learn/ux-design-fundamentals', 1, 14),
  ('ui_ux_designer', 'Learn Figma',                'https://www.figma.com/resources/learn-design/',          2, 14),
  ('ui_ux_designer', 'Study UX research methods',  'https://www.nngroup.com/articles/',                      3, 14),
  ('ui_ux_designer', 'Build a case study project',  null,                                                    4, 21),
  ('ui_ux_designer', 'Create a portfolio',          null,                                                    5, 14),
  ('ui_ux_designer', 'Apply to design internships', null,                                                    6, 7)
on conflict do nothing;
