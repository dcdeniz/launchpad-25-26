alter table public.stops
  add column if not exists lat double precision,
  add column if not exists lng double precision;

create table public.roadworks (
  id         bigint generated always as identity primary key,
  title      text not null,
  description text,
  stop_id    bigint references public.stops(id) on delete set null,
  start_date date not null,
  end_date   date,
  reported_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.roadworks enable row level security;

create policy "Public read access to roadworks"
  on public.roadworks for select using (true);

create policy "Authenticated users can report roadworks"
  on public.roadworks for insert
  with check (auth.uid() is not null);

create policy "Admins can manage roadworks"
  on public.roadworks for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
