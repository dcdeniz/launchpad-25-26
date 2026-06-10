'use client'

import { useState, useEffect, useTransition } from 'react'
import { createVehicle, deleteVehicle } from '@/actions/admin'
import { createClient } from '@/lib/supabase/client'

const VEHICLE_TYPES = ['Double-decker bus', 'Single-decker bus', 'Minibus', 'Tram', 'Train']

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [routes,   setRoutes]   = useState<any[]>([])
  const [error,    setError]    = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function load() {
    const supabase = createClient()
    const [v, r] = await Promise.all([
      supabase.from('vehicles').select('id, vehicle_type, routes(route_name)').order('id'),
      supabase.from('routes').select('id, route_name'),
    ])
    setVehicles(v.data ?? [])
    setRoutes(r.data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const result = await createVehicle(new FormData(e.currentTarget))
    if (result?.error) setError(result.error)
    else { (e.target as HTMLFormElement).reset(); load() }
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this vehicle?')) return
    startTransition(async () => { await deleteVehicle(id); load() })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-4">ADD VEHICLE</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="vehicle_type" required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a] appearance-none bg-white">
              <option value="">Vehicle type…</option>
              {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="route_id"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a] appearance-none bg-white">
              <option value="">Assign to route (optional)</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
            </select>
          </div>
          <button type="submit"
            className="bg-[#0b1f3a] hover:bg-[#1a3358] text-white font-display tracking-widest px-5 py-2.5 rounded-xl text-sm transition-colors">
            ADD VEHICLE
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="font-display text-xl text-[#0b1f3a] tracking-wider">FLEET ({vehicles.length})</p>
        </div>
        {vehicles.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No vehicles yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {vehicles.map(v => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-[#0b1f3a]">{v.vehicle_type}</p>
                  <p className="text-xs text-slate-400">{(v.routes as any)?.route_name ?? 'Unassigned'}</p>
                </div>
                <button onClick={() => handleDelete(v.id)} disabled={isPending}
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
