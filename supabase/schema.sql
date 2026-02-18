create extension if not exists pgcrypto;

-- Core table for crawler/admin flow
create table if not exists public.performances (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"ko":"", "zh-TW":""}'::jsonb,
  performance_date date not null,
  ticket_link_global text,
  status text not null default 'Hold' check (status in ('Hold', 'Approve', 'Reject')),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Duplicate protection: title(ko) + date
create unique index if not exists performances_unique_title_ko_date_idx
  on public.performances ((title->>'ko'), performance_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_performances_updated_at on public.performances;
create trigger trg_performances_updated_at
before update on public.performances
for each row
execute function public.set_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================
alter table public.performances enable row level security;

drop policy if exists "public_read_approved_performances" on public.performances;
create policy "public_read_approved_performances"
on public.performances
for select
to anon, authenticated
using (status = 'Approve');

drop policy if exists "service_role_all_performances" on public.performances;
create policy "service_role_all_performances"
on public.performances
for all
to service_role
using (true)
with check (true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.performances to anon, authenticated;
grant all on public.performances to service_role;
