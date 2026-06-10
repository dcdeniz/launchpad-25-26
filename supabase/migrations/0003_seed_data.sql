-- ============================================================
-- Seed: Ladywood area transport network
-- ============================================================

insert into public.routes (route_name) values
  ('Route 9 — City Centre to Quinton'),
  ('Route 16 — City Centre to Bearwood'),
  ('Route 82 — Ladywood Express');

insert into public.stops (stop_name, lat, lng) values
  ('Birmingham City Centre (Broad Street)', 52.4762, -1.9058),
  ('Brindleyplace',                          52.4757, -1.9096),
  ('Five Ways',                              52.4734, -1.9131),
  ('Ladywood Middleway',                     52.4812, -1.9198),
  ('Hagley Road (Monument Road)',            52.4839, -1.9237),
  ('St Vincent Street West',                52.4826, -1.9225),
  ('Ladywood Leisure Centre',               52.4855, -1.9260),
  ('Summer Hill Road',                      52.4876, -1.9228),
  ('Icknield Port Road',                    52.4897, -1.9312),
  ('Ladywood Road (Browning Street)',        52.4855, -1.9245);

insert into public.vehicles (vehicle_type, route_id)
select 'Double-decker bus', r.id from public.routes r where r.route_name = 'Route 9 — City Centre to Quinton'
union all
select 'Single-decker bus', r.id from public.routes r where r.route_name = 'Route 9 — City Centre to Quinton'
union all
select 'Double-decker bus', r.id from public.routes r where r.route_name = 'Route 16 — City Centre to Bearwood'
union all
select 'Single-decker bus', r.id from public.routes r where r.route_name = 'Route 16 — City Centre to Bearwood'
union all
select 'Minibus',            r.id from public.routes r where r.route_name = 'Route 82 — Ladywood Express';

-- Route 9
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham City Centre (Broad Street)', 1),
  ('Brindleyplace',                          2),
  ('Five Ways',                              3),
  ('Ladywood Middleway',                     4),
  ('Hagley Road (Monument Road)',            5),
  ('Icknield Port Road',                    6)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 9 — City Centre to Quinton';

-- Route 16
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham City Centre (Broad Street)', 1),
  ('Brindleyplace',                          2),
  ('Five Ways',                              3),
  ('Ladywood Middleway',                     4),
  ('St Vincent Street West',                5),
  ('Ladywood Leisure Centre',               6)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 16 — City Centre to Bearwood';

-- Route 82
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham City Centre (Broad Street)', 1),
  ('Ladywood Middleway',                     2),
  ('St Vincent Street West',                3),
  ('Summer Hill Road',                      4),
  ('Ladywood Road (Browning Street)',        5),
  ('Five Ways',                              6)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 82 — Ladywood Express';

-- Schedules: Route 9 every 15 min 06:45–22:00
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:45' + (n * interval '15 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 62) as n
join public.routes r on r.route_name = 'Route 9 — City Centre to Quinton'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Schedules: Route 16 every 20 min 06:00–23:00
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:00' + (n * interval '20 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 51) as n
join public.routes r on r.route_name = 'Route 16 — City Centre to Bearwood'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Schedules: Route 82 every 30 min 07:30–20:30
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '07:30' + (n * interval '30 minutes') + ((rs.stop_order - 1) * interval '4 minutes'))::time
from generate_series(0, 26) as n
join public.routes r on r.route_name = 'Route 82 — Ladywood Express'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;
