'use client'

import { signIn } from '@/actions/auth'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn(new FormData(e.currentTarget))
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-2">Welcome back</p>
          <h1 className="font-display text-4xl text-[#0b1f3a] tracking-wider">SIGN IN</h1>
          <p className="text-slate-500 text-sm mt-1">Access your journey planner and tickets.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Email address</label>
            <input name="email" type="email" required
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Password</label>
            <input name="password" type="password" required
              className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b1f3a] hover:bg-[#1a3358] disabled:opacity-50 text-white font-display text-xl tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98]"
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          No account?{' '}
          <Link href="/signup" className="text-[#0b1f3a] font-semibold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
