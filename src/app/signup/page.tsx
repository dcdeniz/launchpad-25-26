'use client'

import { signUp } from '@/actions/auth'
import Link from 'next/link'
import { useState } from 'react'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signUp(new FormData(e.currentTarget))
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#f5a623] text-xs font-semibold uppercase tracking-[0.2em] mb-2">Join</p>
          <h1 className="font-display text-4xl text-[#0b1f3a] tracking-wider">CREATE ACCOUNT</h1>
          <p className="text-slate-500 text-sm mt-1">Plan journeys, track tickets, and more.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" name="first_name" type="text" required />
            <Field label="Last name"  name="last_name"  type="text" required />
          </div>
          <Field label="Email address" name="email"    type="email"    required />
          <Field label="Password"      name="password" type="password" required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b1f3a] hover:bg-[#1a3358] disabled:opacity-50 text-white font-display text-xl tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98]"
          >
            {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0b1f3a] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function Field({ label, name, type, required }: { label: string; name: string; type: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em]">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
      />
    </div>
  )
}
