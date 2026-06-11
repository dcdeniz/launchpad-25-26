import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const ROUTE_COLORS: Record<string, string> = {
  T1: '#00a699', T2: '#00a699',
  SN1: '#c0392b',
  '9': '#e63946', '16': '#457b9d', '82': '#2d6a4f',
  '11A': '#d97706', '11C': '#d97706',
  '45': '#7c3aed', '126': '#1e3a5f',
}

function getRouteIdentifier(name: string): string {
  const beforeDash = name.split(' — ')[0].trim()
  const parts = beforeDash.split(' ')
  return parts[parts.length - 1] ?? name.slice(0, 4)
}

function getRouteColor(name: string): string {
  if (name.startsWith('Metro')) return '#00a699'
  if (name.startsWith('Train')) return '#c0392b'
  return ROUTE_COLORS[getRouteIdentifier(name)] ?? '#6b4c9a'
}

async function getRoute(id: number) {
  try {
    const supabase = await createClient()
    const { data: route } = await supabase
      .from('routes').select('id, route_name').eq('id', id).single()
    if (!route) return null

    const { data: routeStops } = await supabase
      .from('route_stops')
      .select('stop_order, stops(id, stop_name)')
      .eq('route_id', id)
      .order('stop_order')

    const stops = (routeStops ?? [])
      .sort((a, b) => a.stop_order - b.stop_order)
      .map(rs => ({ stopOrder: rs.stop_order, ...(rs.stops as any) }))

    const { data: schedules } = await supabase
      .from('schedules')
      .select('stop_id, arrival_time')
      .eq('route_id', id)
      .order('arrival_time')
      .limit(1000)

    // Sort times using transit service-day convention: 00:00–04:59 sorts after 23:59
    function serviceMinutes(t: string) {
      const [h, m] = t.split(':').map(Number)
      return h < 5 ? h * 60 + m + 1440 : h * 60 + m
    }

    const stopSchedules: Record<number, string[]> = {}
    ;(schedules ?? []).forEach(s => {
      if (!stopSchedules[s.stop_id]) stopSchedules[s.stop_id] = []
      const t = s.arrival_time.slice(0, 5)
      if (!stopSchedules[s.stop_id].includes(t)) stopSchedules[s.stop_id].push(t)
    })
    Object.keys(stopSchedules).forEach(k => {
      stopSchedules[Number(k)].sort((a, b) => serviceMinutes(a) - serviceMinutes(b))
    })

    return { route, stops, stopSchedules }
  } catch {
    return null
  }
}

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)

  if (isNaN(id)) notFound()

  const data = await getRoute(id)

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="font-display text-2xl text-[#0b1f3a]/40 tracking-wider">ROUTE NOT FOUND</p>
        <Link href="/routes" className="mt-4 inline-block text-sm text-[#0b1f3a] underline">← All routes</Link>
      </div>
    )
  }

  const { route, stops, stopSchedules } = data
  const routeColor = getRouteColor(route.route_name)
  const routeNum = getRouteIdentifier(route.route_name)

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      {/* Back */}
      <Link href="/routes" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 mb-6 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        All routes
      </Link>

      {/* Route header */}
      <div className="rounded-2xl p-5 mb-6 flex items-center gap-4" style={{ backgroundColor: routeColor }}>
        <span className="font-display text-5xl text-white tracking-wider leading-none">{routeNum}</span>
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Route</p>
          <p className="text-white font-semibold text-base leading-tight">{route.route_name}</p>
          <p className="text-white/60 text-xs mt-0.5">{stops.length} stops</p>
        </div>
      </div>

      {/* Stops + schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-display text-lg text-[#0b1f3a] tracking-wider">STOPS & TIMES</p>
          <p className="text-xs text-slate-400 font-mono">Today's timetable</p>
        </div>

        {stops.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-slate-400">No stop data available</div>
        ) : (
          <div>
            {stops.map((stop, i) => {
              const times = (stopSchedules[stop.id] ?? []).slice(0, 5)
              const isLast = i === stops.length - 1
              return (
                <div key={stop.id} className={`flex gap-4 px-4 py-3.5 ${!isLast ? 'border-b border-slate-50' : ''}`}>
                  {/* Stop indicator */}
                  <div className="flex flex-col items-center pt-0.5">
                    <div className="w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: routeColor }} />
                    {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ background: 'currentColor', opacity: 0.15 }} />}
                  </div>

                  {/* Stop info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0b1f3a] leading-tight">{stop.stop_name}</p>
                    {times.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {times.map(t => (
                          <span key={t} className="departure-cell">{t}</span>
                        ))}
                        {(stopSchedules[stop.id]?.length ?? 0) > 5 && (
                          <span className="text-xs text-slate-400 self-center">+{(stopSchedules[stop.id]?.length ?? 0) - 5} more</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mt-1">No times available</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Purchase ticket CTA */}
      <Link
        href="/tickets"
        className="block w-full bg-[#f5a623] hover:bg-[#d4891a] text-[#0b1f3a] font-display text-xl tracking-widest py-4 rounded-xl text-center transition-colors"
      >
        BUY A TICKET FOR THIS ROUTE →
      </Link>
    </div>
  )
}
