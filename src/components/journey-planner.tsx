'use client'

import { useState } from 'react'
import type { Stop } from '@/types'

interface Props {
  stops: Stop[]
}

const DEMO_STOPS: Stop[] = [
  { id: 1,  stop_name: 'Birmingham City Centre (Broad Street)', lat: 52.4762, lng: -1.9058 },
  { id: 2,  stop_name: 'Brindleyplace',                         lat: 52.4757, lng: -1.9096 },
  { id: 3,  stop_name: 'Five Ways',                             lat: 52.4734, lng: -1.9131 },
  { id: 4,  stop_name: 'Ladywood Middleway',                    lat: 52.4812, lng: -1.9198 },
  { id: 5,  stop_name: 'Hagley Road (Monument Road)',           lat: 52.4839, lng: -1.9237 },
  { id: 6,  stop_name: 'St Vincent Street West',               lat: 52.4826, lng: -1.9225 },
  { id: 7,  stop_name: 'Ladywood Leisure Centre',              lat: 52.4855, lng: -1.9260 },
  { id: 8,  stop_name: 'Summer Hill Road',                     lat: 52.4876, lng: -1.9228 },
  { id: 9,  stop_name: 'Icknield Port Road',                   lat: 52.4897, lng: -1.9312 },
  { id: 10, stop_name: 'Ladywood Road (Browning Street)',      lat: 52.4855, lng: -1.9245 },
]

export function JourneyPlanner({ stops }: Props) {
  const allStops = stops.length > 0 ? stops : DEMO_STOPS
  const now = new Date()
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [from, setFrom]       = useState('')
  const [to, setTo]           = useState('')
  const [time, setTime]       = useState(defaultTime)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan]       = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPlan(null)
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromStopId: parseInt(from), toStopId: parseInt(to), time }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setPlan(data.plan)
    } catch {
      setError('Could not reach the journey planner. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0b1f3a] transition-colors appearance-none'
  const labelClass = 'block text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-1'

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* From / To */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} required className={inputClass}>
              <option value="">Select stop…</option>
              {allStops.filter(s => s.id.toString() !== to).map(s => (
                <option key={s.id} value={s.id}>{s.stop_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>To</label>
            <select value={to} onChange={e => setTo(e.target.value)} required className={inputClass}>
              <option value="">Select stop…</option>
              {allStops.filter(s => s.id.toString() !== from).map(s => (
                <option key={s.id} value={s.id}>{s.stop_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time */}
        <div>
          <label className={labelClass}>Depart after</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Search */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0b1f3a] hover:bg-[#1a3358] disabled:opacity-60 text-white font-display text-lg tracking-widest py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              SEARCHING…
            </>
          ) : 'SEARCH →'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {plan && (
        <div className="animate-fade-up border-l-4 border-[#0b1f3a] bg-slate-50 rounded-r-xl pl-4 pr-4 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-1.5">Journey Plan</p>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{plan}</p>
        </div>
      )}
    </div>
  )
}
