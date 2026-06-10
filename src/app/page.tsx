import { JourneyPlanner } from '@/components/journey-planner'
import { RouteCard } from '@/components/route-card'
import { createClient } from '@/lib/supabase/server'
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

export default async function HomePage() {
  const { stops, routes } = await getData()

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="hero-bg px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Headline */}
          <div className="mb-8 animate-fade-up">
            <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-3 stagger-1 animate-fade-up">
              Birmingham · Ladywood
            </p>
            <h1 className="font-display text-[clamp(3rem,12vw,5.5rem)] leading-[0.92] text-white tracking-wide">
              GETTING<br />AROUND<br />
              <span className="text-[#f5a623]">LADYWOOD</span>
            </h1>
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed stagger-2 animate-fade-up">
              Buses · Trams · Trains — unified in one place.<br className="hidden sm:block" />
              Plan your journey across the Ladywood area instantly.
            </p>
          </div>

          {/* Journey planner */}
          <div className="stagger-3 animate-fade-up">
            <JourneyPlanner stops={stops as Stop[]} />
          </div>
        </div>
      </section>

      {/* ── Quick stats strip ────────────────────────────────────── */}
      <div className="bg-[#f5a623]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto">
          {[
            { label: 'Routes', value: routes.length || 3 },
            { label: 'Stops',  value: stops.length  || 10 },
            { label: 'Area',   value: 'Ladywood' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <span className="font-display text-2xl text-[#0b1f3a] tracking-wider">{value}</span>
              <span className="text-xs font-semibold text-[#0b1f3a]/60 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Routes section ───────────────────────────────────────── */}
      <section className="px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-[#0b1f3a] tracking-wider">SERVICES</h2>
          <a href="/routes" className="text-xs font-semibold text-[#0b1f3a]/50 uppercase tracking-wider hover:text-[#0b1f3a] transition-colors">
            View all →
          </a>
        </div>

        {routes.length > 0 ? (
          <div className="space-y-3">
            {(routes as Route[]).slice(0, 6).map((route, i) => (
              <div key={route.id} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
                <RouteCard id={route.id} name={route.route_name} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { id: 0, route_name: 'Route 9 — City Centre to Quinton' },
              { id: 0, route_name: 'Route 16 — City Centre to Bearwood' },
              { id: 0, route_name: 'Route 82 — Ladywood Express' },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden opacity-60">
                <div className="flex items-stretch">
                  <div className={`${['bg-[#e63946]','bg-[#457b9d]','bg-[#2d6a4f]'][i]} flex items-center justify-center w-16`}>
                    <span className="font-display text-2xl text-white">{['9','16','82'][i]}</span>
                  </div>
                  <div className="flex-1 p-4">
                    <p className="font-semibold text-[#0b1f3a] text-sm">{r.route_name}</p>
                    <p className="text-xs text-slate-400 mt-1">Connect Supabase to load live data</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Info strip ───────────────────────────────────────────── */}
      <section className="mt-auto bg-[#0b1f3a] px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-lg text-white/40 tracking-wider mb-4">QUICK LINKS</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: '/routes',    label: 'Browse Routes',  sub: 'All services' },
              { href: '/tickets',   label: 'My Tickets',     sub: 'Purchase & view' },
              { href: '/signup',    label: 'Create Account', sub: 'Free to join' },
            ].map(({ href, label, sub }) => (
              <a
                key={href}
                href={href}
                className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group"
              >
                <p className="text-sm font-semibold text-white group-hover:text-[#f5a623] transition-colors">{label}</p>
                <p className="text-xs text-white/40 mt-0.5">{sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
