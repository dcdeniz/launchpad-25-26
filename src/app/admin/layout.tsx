import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const adminLinks = [
  { href: '/admin',             label: 'Overview' },
  { href: '/admin/routes',      label: 'Routes' },
  { href: '/admin/stops',       label: 'Stops' },
  { href: '/admin/schedules',   label: 'Schedules' },
  { href: '/admin/vehicles',    label: 'Vehicles' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/dashboard')
  } catch {
    redirect('/login')
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6">
      {/* Admin header */}
      <div className="mb-6">
        <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-1">TfWM</p>
        <h1 className="font-display text-3xl text-[#0b1f3a] tracking-wider">ADMIN PANEL</h1>
      </div>

      {/* Admin sub-nav */}
      <nav className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {adminLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 bg-white border border-slate-200 hover:border-[#0b1f3a] text-[#0b1f3a] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-colors hover:bg-[#0b1f3a] hover:text-white"
          >
            {label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  )
}
