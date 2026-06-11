-- Profiles extends auth.users with display name and role for each registered user.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text not null default 'resident' check (role in ('resident', 'admin'))
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Routes
create table public.routes (
  id bigint generated always as identity primary key,
  route_name text unique not null
);

alter table public.routes enable row level security;

create policy "Public read access to routes"
  on public.routes for select using (true);

create policy "Admins can manage routes"
  on public.routes for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Vehicles
create table public.vehicles (
  id bigint generated always as identity primary key,
  vehicle_type text not null,
  route_id bigint references public.routes(id) on delete set null
);

alter table public.vehicles enable row level security;

create policy "Public read access to vehicles"
  on public.vehicles for select using (true);

create policy "Admins can manage vehicles"
  on public.vehicles for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Stops
create table public.stops (
  id bigint generated always as identity primary key,
  stop_name text not null
);

alter table public.stops enable row level security;

create policy "Public read access to stops"
  on public.stops for select using (true);

create policy "Admins can manage stops"
  on public.stops for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- RouteStops (junction)
create table public.route_stops (
  route_id bigint references public.routes(id) on delete cascade,
  stop_id bigint references public.stops(id) on delete cascade,
  stop_order integer not null,
  primary key (route_id, stop_id)
);

alter table public.route_stops enable row level security;

create policy "Public read access to route stops"
  on public.route_stops for select using (true);

create policy "Admins can manage route stops"
  on public.route_stops for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Schedules
create table public.schedules (
  id bigint generated always as identity primary key,
  route_id bigint references public.routes(id) on delete cascade,
  stop_id bigint references public.stops(id) on delete cascade,
  arrival_time time not null
);

alter table public.schedules enable row level security;

create policy "Public read access to schedules"
  on public.schedules for select using (true);

create policy "Admins can manage schedules"
  on public.schedules for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Tickets
create table public.tickets (
  id bigint generated always as identity primary key,
  account_id uuid references public.profiles(id) on delete cascade,
  route_id bigint references public.routes(id) on delete set null,
  vehicle_id bigint references public.vehicles(id) on delete set null,
  price numeric(10, 2) not null,
  purchase_date date not null default current_date
);

alter table public.tickets enable row level security;

create policy "Users can view their own tickets"
  on public.tickets for select
  using (auth.uid() = account_id);

create policy "Users can purchase tickets"
  on public.tickets for insert
  with check (auth.uid() = account_id);

create policy "Admins can view all tickets"
  on public.tickets for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
