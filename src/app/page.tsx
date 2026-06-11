import { JourneyPlanner } from '@/components/journey-planner'
import { RouteCard } from '@/components/route-card'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Stop, Route } from '@/types'

async function getData() {
  try {
    const supabase = await createClient()
    const [{ data: stops }, { data: routes }] = await Promise.all([
      supabase.from('stops').select('id, stop_name, lat, lng').order('stop_name'),
      supabase.from('routes').select('id, route_name'),
    ])
    return { stops: stops ?? [], routes: routes ?? [] }
  } catch {
    return { stops: [], routes: [] }
  }
}

const DEMO_ROUTES = [
  { id: 1, route_name: 'Route 9 — City Centre to Quinton' },
  { id: 2, route_name: 'Route 16 — City Centre to Bearwood' },
  { id: 3, route_name: 'Route 82 — Ladywood Express' },
  { id: 4, route_name: 'Metro T1 — Wolverhampton to Birmingham Centenary Square' },
  { id: 5, route_name: 'Metro T2 — Edgbaston to Jewellery Quarter' },
  { id: 6, route_name: 'Train SN1 — Birmingham New Street to Five Ways' },
]

export default async function HomePage() {
  const { stops, routes } = await getData()
  const displayRoutes = routes.length > 0 ? (routes as Route[]).slice(0, 6) : DEMO_ROUTES

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Hero: two-column ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 items-start">

          {/* LEFT — styled hero panel */}
          <div>
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: '#0b1f3a',
                backgroundImage: `
                  radial-gradient(ellipse at 20% 70%, rgba(245,166,35,0.15) 0%, transparent 55%),
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: 'auto, 40px 40px, 40px 40px',
                minHeight: '320px',
              }}
            >
              {/* Decorative route badges */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: '9',  color: '#e63946' }, { id: '16', color: '#457b9d' },
                    { id: '82', color: '#2d6a4f' }, { id: 'T1', color: '#00a699' },
                    { id: 'T2', color: '#00a699' }, { id: 'SN1', color: '#c0392b' },
                    { id: '11A', color: '#d97706' }, { id: '45', color: '#7c3aed' },
                  ].map(({ id, color }) => (
                    <span
                      key={id}
                      className="font-display text-white text-lg tracking-widest px-2.5 py-0.5 rounded"
                      style={{ background: color }}
                    >
                      {id}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="font-display text-[clamp(2.5rem,8vw,4rem)] leading-none text-white tracking-wide">
                    LADYWOOD<br />
                    <span className="text-[#f5a623]">TRANSIT</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-3 text-slate-500 text-sm leading-relaxed px-1">
              Buses · Trams · Trains — all services unified in one place.
              Plan your journey across the Ladywood area instantly.
            </p>
          </div>

          {/* RIGHT — journey planner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-4">PLAN YOUR JOURNEY</p>
            <JourneyPlanner stops={stops as Stop[]} />
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-[#0b1f3a] tracking-wider">SERVICES</h2>
          <Link href="/routes" className="text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-[#0b1f3a] transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayRoutes.map((route, i) => (
            <div key={route.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
              <RouteCard id={route.id} name={route.route_name} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer quick links ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: '/routes',    label: 'Stops',    sub: 'Browse all stops',     accent: '#457b9d' },
            { href: '/tickets',   label: 'Tickets',  sub: 'Purchase & manage',    accent: '#f5a623' },
            { href: '/dashboard', label: 'Account',  sub: 'Your profile & trips', accent: '#2d6a4f' },
          ].map(({ href, label, sub, accent }) => (
            <Link
              key={href}
              href={href}
              className="block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div
                className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-10"
                style={{ background: accent }}
              />
              <p className="font-display text-xl text-[#0b1f3a] tracking-wider group-hover:text-[#0b1f3a]">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
