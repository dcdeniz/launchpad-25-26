'use client'

import { useState, useEffect, useTransition } from 'react'
import { createStop, deleteStop } from '@/actions/admin'
import { createClient } from '@/lib/supabase/client'

export default function AdminStopsPage() {
  const [stops, setStops]   = useState<any[]>([])
  const [error, setError]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function load() {
    const supabase = createClient()
    const { data } = await supabase.from('stops').select('id, stop_name, lat, lng').order('stop_name')
    setStops(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const result = await createStop(new FormData(e.currentTarget))
    if (result?.error) setError(result.error)
    else { (e.target as HTMLFormElement).reset(); load() }
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this stop?')) return
    startTransition(async () => { await deleteStop(id); load() })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-4">ADD STOP</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleAdd} className="space-y-3">
          <input name="stop_name" required placeholder="Stop name"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="lat" type="number" step="any" placeholder="Latitude (optional)"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a]" />
            <input name="lng" type="number" step="any" placeholder="Longitude (optional)"
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0b1f3a]" />
          </div>
          <button type="submit" className="bg-[#0b1f3a] hover:bg-[#1a3358] text-white font-display tracking-widest px-5 py-2.5 rounded-xl text-sm transition-colors">
            ADD STOP
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <p className="font-display text-xl text-[#0b1f3a] tracking-wider">ALL STOPS ({stops.length})</p>
        </div>
        {stops.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">No stops yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {stops.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-[#0b1f3a]">{s.stop_name}</p>
                  {s.lat && s.lng && (
                    <p className="text-xs text-slate-400 font-mono">{s.lat.toFixed(4)}, {s.lng.toFixed(4)}</p>
                  )}
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
