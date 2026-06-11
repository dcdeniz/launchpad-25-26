'use client'

import { useState, useEffect, useTransition } from 'react'
import { createSchedule, deleteSchedule } from '@/actions/admin'
import { createClient } from '@/lib/supabase/client'

export default function AdminSchedulesPage() {
  const [schedules,   setSchedules]   = useState<any[]>([])
  const [total,       setTotal]       = useState<number>(0)
  const [routes,      setRoutes]      = useState<any[]>([])
  const [stops,       setStops]       = useState<any[]>([])
  const [filterRoute, setFilterRoute] = useState('')
  const [error,       setError]       = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  async function load(routeFilter = filterRoute) {
    const supabase = createClient()
    const [r, st] = await Promise.all([
      supabase.from('routes').select('id, route_name').order('route_name'),
      supabase.from('stops').select('id, stop_name').order('stop_name'),
    ])
    setRoutes(r.data ?? [])
    setStops(st.data ?? [])

    let countQuery = supabase.from('schedules').select('id', { count: 'exact', head: true })
    let listQuery  = supabase.from('schedules')
      .select('id, arrival_time, routes(route_name), stops(stop_name)')
      .order('arrival_time')
      .limit(100)

    if (routeFilter) {
      countQuery = countQuery.eq('route_id', routeFilter) as any
      listQuery  = listQuery.eq('route_id', routeFilter) as any
    }

    const [cnt, list] = await Promise.all([countQuery, listQuery])
    setTotal(cnt.count ?? 0)
    setSchedules(list.data ?? [])
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleRouteFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilterRoute(e.target.value)
    load(e.target.value)
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const result = await createSchedule(new FormData(e.currentTarget))
    if (result?.error) setError(result.error)
    else { (e.target as HTMLFormElement).reset(); load() }
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this schedule entry?')) return
    startTransition(async () => { await deleteSchedule(id); load() })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-4">ADD SCHEDULE ENTRY</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select name="route_id" required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a] appearance-none bg-white">
              <option value="">Select route…</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
            </select>
            <select name="stop_id" required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a] appearance-none bg-white">
              <option value="">Select stop…</option>
              {stops.map(s => <option key={s.id} value={s.id}>{s.stop_name}</option>)}
            </select>
            <input name="arrival_time" type="time" required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a]" />
          </div>
          <button type="submit"
            className="bg-[#0b1f3a] hover:bg-[#1a3358] text-white font-display tracking-widest px-5 py-2.5 rounded-xl text-sm transition-colors">
            ADD ENTRY
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <p className="font-display text-xl text-[#0b1f3a] tracking-wider">
            SCHEDULES
            <span className="ml-2 text-sm font-sans font-normal text-slate-400">
              {filterRoute ? `${schedules.length} of ${total}` : `${total} total`}
              {!filterRoute && schedules.length < total && ` — showing ${schedules.length}`}
            </span>
          </p>
          <select
            value={filterRoute}
            onChange={handleRouteFilter}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#0b1f3a] appearance-none bg-white text-slate-600 max-w-[220px]"
          >
            <option value="">All routes</option>
            {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
          </select>
        </div>
        {schedules.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No schedule entries.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {schedules.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <span className="departure-cell">{s.arrival_time?.slice(0, 5)}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0b1f3a]">{(s.routes as any)?.route_name}</p>
                    <p className="text-xs text-slate-500">@ {(s.stops as any)?.stop_name}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)} disabled={isPending}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold uppercase tracking-wider disabled:opacity-40">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
