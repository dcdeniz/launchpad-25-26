import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getStats() {
  try {
    const supabase = await createClient()
    const [routes, stops, vehicles, schedules] = await Promise.all([
      supabase.from('routes').select('id', { count: 'exact', head: true }),
      supabase.from('stops').select('id', { count: 'exact', head: true }),
      supabase.from('vehicles').select('id', { count: 'exact', head: true }),
      supabase.from('schedules').select('id', { count: 'exact', head: true }),
    ])
    return {
      routes:    routes.count    ?? 0,
      stops:     stops.count     ?? 0,
      vehicles:  vehicles.count  ?? 0,
      schedules: schedules.count ?? 0,
    }
  } catch {
    return { routes: 0, stops: 0, vehicles: 0, schedules: 0 }
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Routes',    value: stats.routes,    href: '/admin/routes',    color: 'bg-[#e63946]' },
    { label: 'Stops',     value: stats.stops,     href: '/admin/stops',     color: 'bg-[#457b9d]' },
    { label: 'Vehicles',  value: stats.vehicles,  href: '/admin/vehicles',  color: 'bg-[#2d6a4f]' },
    { label: 'Schedules', value: stats.schedules, href: '/admin/schedules', color: 'bg-[#6b4c9a]' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(({ label, value, href, color }) => (
          <Link key={label} href={href} className="block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
            <div className={`${color} h-1.5`} />
            <div className="p-4">
              <p className="font-display text-4xl text-[#0b1f3a] tracking-wider">{value}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[#0b1f3a] rounded-2xl p-5 text-white">
        <p className="font-display text-xl tracking-wider mb-1">SYSTEM STATUS</p>
        <p className="text-white/50 text-sm">All services operational · Last updated just now</p>
      </div>
    </div>
  )
}
