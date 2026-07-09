-- Forge Web workspace persistence (server-only via service role)

create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_clerk_user_id_idx on public.workspaces (clerk_user_id);

-- Server-only access: disable RLS; all reads/writes go through the service role key.
alter table public.workspaces disable row level security;