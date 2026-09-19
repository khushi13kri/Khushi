-- OREVON V2: initial persistence schema.
--
-- Scope: persists the same three pieces of state that already live in
-- src/state/app-state.tsx — assessment answers, routine logs, and
-- notification preferences. Chat history stays local-only for now
-- (not core to personalization, and keeping it out keeps this first
-- persistence pass small).
--
-- Identity: every table is keyed by auth.uid(), the id Supabase Auth
-- assigns on signInAnonymously(). No separate "users" table needed —
-- Supabase's built-in auth.users already exists.
--
-- Run this once in the Supabase Dashboard's SQL Editor (Project ->
-- SQL Editor -> New query), or via the Supabase CLI if you use one.

-- One row per user: their current assessment answers.
create table if not exists public.assessments (
  user_id uuid primary key references auth.users (id) on delete cascade,
  answers jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

create policy "Users manage their own assessment"
  on public.assessments
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One row per user per calendar date: which routine items were done.
create table if not exists public.routine_logs (
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  morning_brush boolean not null default false,
  night_brush boolean not null default false,
  tongue_clean boolean not null default false,
  floss boolean not null default false,
  mouthwash boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

alter table public.routine_logs enable row level security;

create policy "Users manage their own routine logs"
  on public.routine_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One row per user: notification toggle state.
create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  daily_reminders boolean not null default true,
  weekly_checkins boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users manage their own notification preferences"
  on public.notification_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
