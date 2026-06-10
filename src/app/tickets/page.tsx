'use client'

import { useState, useEffect } from 'react'
import { purchaseTicket } from '@/actions/tickets'
import { TicketCard } from '@/components/ticket-card'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const DEMO_ROUTES = [
  { id: 1, route_name: 'Route 9 — City Centre to Quinton',   price: 2.40 },
  { id: 2, route_name: 'Route 16 — City Centre to Bearwood', price: 2.40 },
  { id: 3, route_name: 'Route 82 — Ladywood Express',        price: 1.80 },
]

const ROUTE_PRICES: Record<string, number> = {
  '1': 2.40, '2': 2.40, '3': 1.80,
}

export default function TicketsPage() {
  const [routes,  setRoutes]  = useState(DEMO_ROUTES)
  const [tickets, setTickets] = useState<any[]>([])
  const [user,    setUser]    = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        const { data: dbRoutes } = await supabase.from('routes').select('id, route_name')
        if (dbRoutes?.length) setRoutes(dbRoutes.map(r => ({ ...r, price: ROUTE_PRICES[r.id] ?? 2.40 })))

        const { data: dbTickets } = await supabase
          .from('tickets')
          .select('id, price, purchase_date, routes(route_name), vehicles(vehicle_type)')
          .eq('account_id', user.id)
          .order('purchase_date', { ascending: false })
          .limit(20)
        setTickets(dbTickets ?? [])
      }
    })
  }, [success])

  async function handlePurchase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const routeId = formData.get('route_id') as string
    const price = ROUTE_PRICES[routeId] ?? 2.40
    formData.set('price', price.toString())

    const result = await purchaseTicket(formData)
    if (result?.error) setError(result.error)
    else { setSuccess(true); setTimeout(() => setSuccess(false), 3000) }
    setLoading(false)
  }

  const selectedPrice = selectedRoute ? (ROUTE_PRICES[selectedRoute] ?? 2.40) : null

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      <div className="mb-6">
        <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Travel</p>
        <h1 className="font-display text-4xl text-[#0b1f3a] tracking-wider">MY TICKETS</h1>
      </div>

      {!user ? (
        <div className="bg-[#0b1f3a] rounded-2xl p-6 text-center">
          <p className="font-display text-2xl text-white tracking-wider mb-2">SIGN IN TO PURCHASE</p>
          <p className="text-white/50 text-sm mb-4">Create an account to buy and manage your tickets.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login"  className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors">Sign in</Link>
            <Link href="/signup" className="bg-[#f5a623] hover:bg-[#d4891a] text-[#0b1f3a] text-sm font-semibold px-5 py-2 rounded-full transition-colors">Register free</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Purchase form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="font-display text-xl text-[#0b1f3a] tracking-wider">BUY A TICKET</p>
            </div>
            <form onSubmit={handlePurchase} className="p-5 space-y-4">
              {error   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
              {success && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">Ticket purchased successfully!</div>}

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Select route</label>
                <select
                  name="route_id"
                  required
                  value={selectedRoute}
                  onChange={e => setSelectedRoute(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0b1f3a] appearance-none"
                >
                  <option value="">Choose a route…</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.route_name}</option>
                  ))}
                </select>
              </div>

              {selectedPrice && (
                <div className="bg-[#0b1f3a]/5 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-600">Single ticket</span>
                  <span className="font-display text-2xl text-[#0b1f3a] tracking-wider">£{selectedPrice.toFixed(2)}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedRoute}
                className="w-full bg-[#0b1f3a] hover:bg-[#1a3358] disabled:opacity-40 text-white font-display text-xl tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? 'PURCHASING…' : `PURCHASE TICKET${selectedPrice ? ` — £${selectedPrice.toFixed(2)}` : ''}`}
              </button>
            </form>
          </div>

          {/* My tickets list */}
          <div>
            <p className="font-display text-xl text-[#0b1f3a] tracking-wider mb-3">RECENT TICKETS</p>
            {tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
                No tickets yet — purchase your first above.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(t => (
                  <TicketCard
                    key={t.id}
                    id={t.id}
                    routeName={(t.routes as any)?.route_name ?? 'Unknown Route'}
                    price={t.price}
                    purchaseDate={t.purchase_date}
                    vehicleType={(t.vehicles as any)?.vehicle_type}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
