'use client'

import { useState, useEffect, useTransition } from 'react'
import { createRoute, deleteRoute } from '@/actions/admin'
import { createClient } from '@/lib/supabase/client'

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [error, setError]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('routes').select('id, route_name').order('id')
    setRoutes(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createRoute(fd)
    if (result?.error) setError(result.error)
    else { (e.target as HTMLFormElement).reset(); load() }
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this route and all its schedules?')) return
    startTransition(async () => { await deleteRoute(id); load() })
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-4">ADD ROUTE</p>
        <form onSubmit={handleAdd} className="flex gap-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input
            name="route_name"
            required
            placeholder="e.g. Route 9 — City Centre to Quinton"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a] transition-colors"
          />
          <button type="submit" className="bg-[#0b1f3a] hover:bg-[#1a3358] text-white font-display tracking-widest px-5 py-2.5 rounded-xl text-sm transition-colors shrink-0">
            ADD
          </button>
        </form>
      </div>

      {/* Routes table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="font-display text-xl text-[#0b1f3a] tracking-wider">ALL ROUTES ({routes.length})</p>
        </div>
        {routes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No routes yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {routes.map(r => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#0b1f3a]">{r.route_name}</p>
                  <p className="text-xs text-slate-400 font-mono">ID #{r.id}</p>
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={isPending}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold uppercase tracking-wider transition-colors disabled:opacity-40"
                >
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
