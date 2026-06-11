-- Extra routes, stops, vehicles, and dense timetable data for the Ladywood network.

-- New routes
insert into public.routes (route_name) values
  ('Metro T1 — Wolverhampton to Birmingham Centenary Square'),
  ('Metro T2 — Edgbaston to Jewellery Quarter'),
  ('Train SN1 — Birmingham New Street to Five Ways'),
  ('Route 11A — City Centre Outer Circle (Clockwise)'),
  ('Route 11C — City Centre Outer Circle (Anti-Clockwise)'),
  ('Route 45 — Ladywood to Selly Oak'),
  ('Route 126 — Jewellery Quarter to Bearwood Night Bus');

-- New stops
insert into public.stops (stop_name, lat, lng) values
  ('Jewellery Quarter Tram Stop',          52.4891, -1.9173),
  ('Centenary Square Tram Stop',           52.4779, -1.9113),
  ('Brindley Place Tram Stop',             52.4760, -1.9100),
  ('Five Ways Station',                    52.4720, -1.9150),
  ('Birmingham New Street',                52.4775, -1.9008),
  ('Grand Central',                        52.4774, -1.8997),
  ('Broad Street (Brasshouse Lane)',        52.4769, -1.9091),
  ('Edgbaston Village',                    52.4690, -1.9290),
  ('Harborne Road (Chad Valley)',           52.4701, -1.9245),
  ('Selly Oak High Street',                52.4388, -1.9342),
  ('Bournville Lane',                      52.4336, -1.9254),
  ('Stirchley High Street',                52.4297, -1.9015),
  ('Kings Heath High Street',              52.4234, -1.8872),
  ('Moseley Village',                      52.4390, -1.8807),
  ('Bearwood Bus Station',                 52.4746, -1.9793),
  ('Cape Hill',                            52.4770, -1.9608),
  ('Smethwick High Street',                52.4913, -1.9683),
  ('Winson Green Road',                    52.4940, -1.9361),
  ('Hunters Road',                         52.4915, -1.9297),
  ('Spring Hill',                          52.4878, -1.9184);

-- Vehicles for the new routes
insert into public.vehicles (vehicle_type, route_id)
select 'CAF Urbos Tram',   r.id from public.routes r where r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
union all
select 'CAF Urbos Tram',   r.id from public.routes r where r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
union all
select 'CAF Urbos Tram',   r.id from public.routes r where r.route_name = 'Metro T2 — Edgbaston to Jewellery Quarter'
union all
select 'Class 172 Train',  r.id from public.routes r where r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
union all
select 'Class 172 Train',  r.id from public.routes r where r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
union all
select 'Double-decker bus',r.id from public.routes r where r.route_name = 'Route 11A — City Centre Outer Circle (Clockwise)'
union all
select 'Double-decker bus',r.id from public.routes r where r.route_name = 'Route 11A — City Centre Outer Circle (Clockwise)'
union all
select 'Double-decker bus',r.id from public.routes r where r.route_name = 'Route 11C — City Centre Outer Circle (Anti-Clockwise)'
union all
select 'Double-decker bus',r.id from public.routes r where r.route_name = 'Route 11C — City Centre Outer Circle (Anti-Clockwise)'
union all
select 'Single-decker bus',r.id from public.routes r where r.route_name = 'Route 45 — Ladywood to Selly Oak'
union all
select 'Single-decker bus',r.id from public.routes r where r.route_name = 'Route 45 — Ladywood to Selly Oak'
union all
select 'Single-decker bus',r.id from public.routes r where r.route_name = 'Route 126 — Jewellery Quarter to Bearwood Night Bus';

-- Route stops for each new route

-- Metro T1 (6 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham New Street',               1),
  ('Centenary Square Tram Stop',          2),
  ('Brindley Place Tram Stop',            3),
  ('Broad Street (Brasshouse Lane)',       4),
  ('Five Ways Station',                   5),
  ('Jewellery Quarter Tram Stop',         6)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square';

-- Metro T2 (4 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Edgbaston Village',                   1),
  ('Harborne Road (Chad Valley)',          2),
  ('Five Ways Station',                   3),
  ('Jewellery Quarter Tram Stop',         4)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Metro T2 — Edgbaston to Jewellery Quarter';

-- Train SN1 (3 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham New Street',               1),
  ('Grand Central',                       2),
  ('Five Ways Station',                   3)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Train SN1 — Birmingham New Street to Five Ways';

-- Route 11A clockwise outer circle (8 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Birmingham City Centre (Broad Street)', 1),
  ('Winson Green Road',                    2),
  ('Hunters Road',                         3),
  ('Spring Hill',                          4),
  ('Ladywood Middleway',                   5),
  ('Five Ways',                            6),
  ('Harborne Road (Chad Valley)',          7),
  ('Edgbaston Village',                   8)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 11A — City Centre Outer Circle (Clockwise)';

-- Route 11C anti-clockwise outer circle (8 stops, reverse of 11A)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Edgbaston Village',                   1),
  ('Harborne Road (Chad Valley)',          2),
  ('Five Ways',                           3),
  ('Ladywood Middleway',                  4),
  ('Spring Hill',                         5),
  ('Hunters Road',                        6),
  ('Winson Green Road',                   7),
  ('Birmingham City Centre (Broad Street)',8)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 11C — City Centre Outer Circle (Anti-Clockwise)';

-- Route 45 (7 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Ladywood Middleway',                  1),
  ('Five Ways',                           2),
  ('Edgbaston Village',                  3),
  ('Harborne Road (Chad Valley)',         4),
  ('Kings Heath High Street',            5),
  ('Stirchley High Street',              6),
  ('Selly Oak High Street',              7)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 45 — Ladywood to Selly Oak';

-- Route 126 night bus (6 stops)
insert into public.route_stops (route_id, stop_id, stop_order)
select r.id, s.id, v.stop_order
from (values
  ('Jewellery Quarter Tram Stop',         1),
  ('Spring Hill',                         2),
  ('Ladywood Middleway',                  3),
  ('Cape Hill',                           4),
  ('Smethwick High Street',              5),
  ('Bearwood Bus Station',               6)
) as v(stop_name, stop_order)
join public.stops  s on s.stop_name  = v.stop_name
join public.routes r on r.route_name = 'Route 126 — Jewellery Quarter to Bearwood Night Bus';

-- Dense timetables for each route
-- Metro T1: every 8 min 05:30–00:00 (peak), denser during rush hours
-- Represented as 3 bands: early (8 min), peak (5 min 07:30–09:30 & 16:30–18:30), standard (8 min)

-- Metro T1 early / off-peak (05:30–07:30, every 8 min → 15 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '05:30' + (n * interval '8 minutes') + ((rs.stop_order - 1) * interval '90 seconds'))::time
from generate_series(0, 14) as n
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Metro T1 AM peak (07:30–09:30, every 5 min → 24 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '07:30' + (n * interval '5 minutes') + ((rs.stop_order - 1) * interval '90 seconds'))::time
from generate_series(0, 23) as n
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Metro T1 midday (09:30–16:30, every 8 min → 52 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '09:30' + (n * interval '8 minutes') + ((rs.stop_order - 1) * interval '90 seconds'))::time
from generate_series(0, 52) as n
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Metro T1 PM peak (16:30–18:30, every 5 min → 24 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '16:30' + (n * interval '5 minutes') + ((rs.stop_order - 1) * interval '90 seconds'))::time
from generate_series(0, 23) as n
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Metro T1 evening (18:30–00:00, every 12 min → 27 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '18:30' + (n * interval '12 minutes') + ((rs.stop_order - 1) * interval '90 seconds'))::time
from generate_series(0, 27) as n
join public.routes r on r.route_name = 'Metro T1 — Wolverhampton to Birmingham Centenary Square'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Metro T2 (every 10 min 06:00–23:00 → 102 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:00' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 101) as n
join public.routes r on r.route_name = 'Metro T2 — Edgbaston to Jewellery Quarter'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Train SN1 AM peak (06:00–09:30, every 10 min → 21 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:00' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 20) as n
join public.routes r on r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Train SN1 off-peak (09:30–16:00, every 20 min → 19 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '09:30' + (n * interval '20 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 19) as n
join public.routes r on r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Train SN1 PM peak (16:00–19:30, every 10 min → 21 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '16:00' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 20) as n
join public.routes r on r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Train SN1 evening (19:30–23:30, every 30 min → 8 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '19:30' + (n * interval '30 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 7) as n
join public.routes r on r.route_name = 'Train SN1 — Birmingham New Street to Five Ways'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 11A clockwise (every 12 min 06:00–23:00 → 85 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:00' + (n * interval '12 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 84) as n
join public.routes r on r.route_name = 'Route 11A — City Centre Outer Circle (Clockwise)'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 11C anti-clockwise (every 12 min 06:00–23:00 → 85 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '06:00' + (n * interval '12 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 84) as n
join public.routes r on r.route_name = 'Route 11C — City Centre Outer Circle (Anti-Clockwise)'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 45 to Selly Oak AM peak (07:00–09:30, every 10 min → 15 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '07:00' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 14) as n
join public.routes r on r.route_name = 'Route 45 — Ladywood to Selly Oak'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 45 off-peak (09:30–16:00, every 20 min → 19 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '09:30' + (n * interval '20 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 19) as n
join public.routes r on r.route_name = 'Route 45 — Ladywood to Selly Oak'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 45 PM peak (16:00–19:00, every 10 min → 18 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '16:00' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 17) as n
join public.routes r on r.route_name = 'Route 45 — Ladywood to Selly Oak'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 45 evening (19:00–23:00, every 30 min → 8 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '19:00' + (n * interval '30 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 7) as n
join public.routes r on r.route_name = 'Route 45 — Ladywood to Selly Oak'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 126 night bus (23:00–04:00, every 30 min → 10 services)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '23:00' + (n * interval '30 minutes') + ((rs.stop_order - 1) * interval '4 minutes'))::time
from generate_series(0, 9) as n
join public.routes r on r.route_name = 'Route 126 — Jewellery Quarter to Bearwood Night Bus'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Backfill denser peak-hour schedules on the original three bus routes
-- Route 9: add AM peak (every 7 min 07:30–09:00) and PM peak (every 7 min 16:30–18:00)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '07:30' + (n * interval '7 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 12) as n
join public.routes r on r.route_name = 'Route 9 — City Centre to Quinton'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '16:30' + (n * interval '7 minutes') + ((rs.stop_order - 1) * interval '2 minutes'))::time
from generate_series(0, 12) as n
join public.routes r on r.route_name = 'Route 9 — City Centre to Quinton'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

-- Route 16: add AM peak (every 10 min 07:30–09:00) and PM peak (every 10 min 16:30–18:00)
insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '07:30' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 9) as n
join public.routes r on r.route_name = 'Route 16 — City Centre to Bearwood'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;

insert into public.schedules (route_id, stop_id, arrival_time)
select r.id, s.id,
  (time '16:30' + (n * interval '10 minutes') + ((rs.stop_order - 1) * interval '3 minutes'))::time
from generate_series(0, 9) as n
join public.routes r on r.route_name = 'Route 16 — City Centre to Bearwood'
join public.route_stops rs on rs.route_id = r.id
join public.stops s on s.id = rs.stop_id;
