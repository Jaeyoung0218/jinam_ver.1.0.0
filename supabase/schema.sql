-- Venues
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ko text not null,
  name_en text,
  name_zh_tw text not null,
  capacity integer,
  location_map_url text
);

-- Performances
create table if not exists public.performances (
  id uuid primary key default gen_random_uuid(),
  title_ko text not null,
  title_zh_tw text,
  artist_name text,
  start_date date not null,
  end_date date,
  venue_id uuid not null references public.venues(id) on delete restrict,
  poster_url text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'ongoing', 'finished', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists performances_unique_idx
  on public.performances (venue_id, start_date, coalesce(end_date, start_date), title_ko);

-- Ticket links
create table if not exists public.ticket_links (
  id uuid primary key default gen_random_uuid(),
  performance_id uuid not null references public.performances(id) on delete cascade,
  provider text not null check (provider in ('WorldNol', 'YES24')),
  url text not null,
  is_global boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists ticket_links_unique_idx
  on public.ticket_links (performance_id, provider);
