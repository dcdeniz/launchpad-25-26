'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/actions/auth'
import type { Profile } from '@/types'

interface NavProps {
  user: Profile | null
}

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconBus() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 3v5h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
function IconTicket() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
    </svg>
  )
}
function IconUser() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function IconAdmin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
function IconMenu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
function IconX() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function Nav({ user }: NavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const bottomTabs = [
    { href: '/',          label: 'Home',    Icon: IconHome },
    { href: '/routes',    label: 'Routes',  Icon: IconBus },
    ...(user ? [{ href: '/tickets',   label: 'Tickets', Icon: IconTicket }] : []),
    { href: user ? '/dashboard' : '/login', label: user ? 'Account' : 'Sign In', Icon: IconUser },
  ]

  const desktopLinks = [
    { href: '/',          label: 'Journey Planner' },
    { href: '/routes',    label: 'Routes' },
    ...(user ? [{ href: '/tickets', label: 'My Tickets' }] : []),
    ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <>
      {/* Sticky top navigation bar */}
      <header className="sticky top-0 z-40 bg-[#0b1f3a] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <span className="text-[#f5a623] font-display text-2xl tracking-widest">LT</span>
            <span className="hidden sm:block text-white font-display text-xl tracking-wider">LADYWOOD TRANSIT</span>
          </Link>

          {/* Centre navigation links shown on desktop screens only */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/" className={`text-sm font-medium px-4 py-1.5 rounded border transition-colors ${
              isActive('/') ? 'border-[#f5a623] text-[#f5a623]' : 'border-white/25 text-white/75 hover:border-white/50 hover:text-white'
            }`}>
              Journey Planner
            </Link>
            <Link href="/routes" className={`text-sm font-medium px-4 py-1.5 rounded border transition-colors ${
              isActive('/routes') ? 'border-[#f5a623] text-[#f5a623]' : 'border-white/25 text-white/75 hover:border-white/50 hover:text-white'
            }`}>
              Routes
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className={`text-sm font-medium px-4 py-1.5 rounded border transition-colors ${
                isActive('/admin') ? 'border-[#f5a623] text-[#f5a623]' : 'border-white/25 text-white/75 hover:border-white/50 hover:text-white'
              }`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Sign in and register buttons shown on desktop screens only */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-medium px-4 py-1.5 rounded border border-white/25 text-white/75 hover:border-white/50 hover:text-white transition-colors">
                  {user.first_name || user.email}
                </Link>
                <form action={signOut}>
                  <button className="text-sm font-medium px-4 py-1.5 rounded border border-white/25 text-white/60 hover:text-white hover:border-white/50 transition-colors">Sign out</button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"  className="text-sm font-medium px-4 py-1.5 rounded border border-white/25 text-white/75 hover:border-white/50 hover:text-white transition-colors">Sign In</Link>
                <Link href="/signup" className="text-sm font-semibold px-4 py-1.5 rounded border border-[#f5a623] bg-[#f5a623] hover:bg-[#d4891a] hover:border-[#d4891a] text-[#0b1f3a] transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {open && (
          <div className="md:hidden animate-slide-down border-t border-white/10 bg-[#0b1f3a]">
            <div className="px-4 py-4 space-y-1">
              {desktopLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-base font-medium border-b border-white/5 ${
                    isActive(href) ? 'text-[#f5a623]' : 'text-white/80'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-3">
                {user ? (
                  <form action={signOut}>
                    <button className="text-sm text-white/50 hover:text-white">Sign out</button>
                  </form>
                ) : (
                  <div className="flex gap-4">
                    <Link href="/login"  onClick={() => setOpen(false)} className="text-sm text-white/70">Sign in</Link>
                    <Link href="/signup" onClick={() => setOpen(false)} className="text-sm text-[#f5a623] font-semibold">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Fixed bottom tab bar shown on mobile screens only */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 safe-area-pb">
        <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${bottomTabs.length}, 1fr)` }}>
          {bottomTabs.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  active ? 'text-[#0b1f3a]' : 'text-slate-400'
                }`}
              >
                <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                  <Icon />
                </span>
                {label}
                {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#f5a623] rounded-t-full" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
