import { RouteCard } from '@/components/route-card'
import { createClient } from '@/lib/supabase/server'

async function getRoutes() {
  try {
    const supabase = await createClient()
    const { data: routes } = await supabase.from('routes').select('id, route_name')
    if (!routes?.length) return []

    const routesWithStops = await Promise.all(
      routes.map(async (route) => {
        const { data: stops } = await supabase
          .from('route_stops')
          .select('stop_order, stops(stop_name)')
          .eq('route_id', route.id)
          .order('stop_order')
        const orderedStops = (stops ?? []).sort((a, b) => a.stop_order - b.stop_order)
        const first = (orderedStops[0]?.stops as any)?.stop_name as string | undefined
        const last  = (orderedStops[orderedStops.length - 1]?.stops as any)?.stop_name as string | undefined
        return { ...route, stopCount: stops?.length ?? 0, firstStop: first, lastStop: last }
      })
    )
    return routesWithStops
  } catch {
    return []
  }
}

const DEMO_ROUTES = [
  { id: 1, route_name: 'Route 9 — City Centre to Quinton',  stopCount: 6, firstStop: 'Birmingham City Centre (Broad Street)', lastStop: 'Icknield Port Road' },
  { id: 2, route_name: 'Route 16 — City Centre to Bearwood', stopCount: 6, firstStop: 'Birmingham City Centre (Broad Street)', lastStop: 'Ladywood Leisure Centre' },
  { id: 3, route_name: 'Route 82 — Ladywood Express',        stopCount: 6, firstStop: 'Birmingham City Centre (Broad Street)', lastStop: 'Five Ways' },
]

export default async function RoutesPage() {
  const routes = await getRoutes()
  const display = routes.length > 0 ? routes : DEMO_ROUTES

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <div className="mb-6">
        <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Ladywood</p>
        <h1 className="font-display text-4xl text-[#0b1f3a] tracking-wider">ALL ROUTES</h1>
        <p className="text-slate-500 text-sm mt-1">{display.length} service{display.length !== 1 ? 's' : ''} operating in the Ladywood area</p>
      </div>

      {routes.length === 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
          Showing demo data — connect Supabase and run migrations to load live routes.
        </div>
      )}

      <div className="space-y-3">
        {display.map((route, i) => (
          <div key={route.id || i} className={`animate-fade-up stagger-${Math.min(i + 1, 5)}`}>
            <RouteCard
              id={route.id}
              name={route.route_name}
              stopCount={route.stopCount}
              firstStop={route.firstStop}
              lastStop={route.lastStop}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
