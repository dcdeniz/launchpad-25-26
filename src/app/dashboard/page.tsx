import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/actions/auth'

async function getData() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [{ data: profile }, { data: tickets }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tickets')
        .select('id, price, purchase_date, routes(route_name)')
        .eq('account_id', user.id)
        .order('purchase_date', { ascending: false })
        .limit(3),
    ])

    return { user, profile, tickets: tickets ?? [] }
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const data = await getData()
  if (!data) redirect('/login')

  const { profile, tickets } = data
  const firstName = profile?.first_name || data.user.email?.split('@')[0] || 'Traveller'
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Welcome back</p>
        <h1 className="font-display text-4xl text-[#0b1f3a] tracking-wider">
          HI, {firstName.toUpperCase()}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{data.user.email}</p>
      </div>

      {/* Admin badge */}
      {isAdmin && (
        <Link href="/admin" className="block mb-6 bg-[#0b1f3a] rounded-2xl p-4 hover:bg-[#1a3358] transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-wider mb-0.5">TfWM Admin</p>
              <p className="text-white font-display text-xl tracking-wider">ADMIN DASHBOARD →</p>
            </div>
            <span className="text-2xl">⚙</span>
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[
          { href: '/',        label: 'PLAN JOURNEY',  sub: 'AI-powered planner', color: 'bg-[#f5a623]', text: 'text-[#0b1f3a]' },
          { href: '/routes',  label: 'VIEW ROUTES',   sub: 'All services',        color: 'bg-white',     text: 'text-[#0b1f3a]' },
          { href: '/tickets', label: 'MY TICKETS',    sub: 'Purchase & manage',   color: 'bg-white',     text: 'text-[#0b1f3a]' },
          { href: '/routes',  label: 'LIVE TIMES',    sub: 'Stop timetables',     color: 'bg-white',     text: 'text-[#0b1f3a]' },
        ].map(({ href, label, sub, color, text }) => (
          <Link key={label} href={href} className={`${color} ${text} rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.98]`}>
            <p className="font-display text-lg tracking-wider">{label}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-50 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent tickets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display text-xl text-[#0b1f3a] tracking-wider">RECENT TICKETS</p>
          <Link href="/tickets" className="text-xs text-slate-400 hover:text-[#0b1f3a] uppercase tracking-wider font-semibold transition-colors">View all →</Link>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-400 text-sm">
            No tickets yet.{' '}
            <Link href="/tickets" className="text-[#0b1f3a] underline">Buy one →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0b1f3a]">{(t.routes as any)?.route_name ?? '—'}</p>
                  <p className="text-xs text-slate-400 font-mono">{t.purchase_date}</p>
                </div>
                <span className="font-display text-lg text-[#0b1f3a]">£{t.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign out */}
      <form action={signOut}>
        <button className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Sign out</button>
      </form>
    </div>
  )
}
