import type { Metadata } from 'next'
import { Bebas_Neue, Lexend, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

const bebas = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas',
  subsets: ['latin'],
  display: 'swap',
})

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ladywood Transit',
  description: 'Unified public transport hub for Ladywood, Birmingham — buses, trams and trains in one place.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user: Profile | null = null
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role')
        .eq('id', authUser.id)
        .single()
      user = data
    }
  } catch { /* Supabase not yet configured */ }

  return (
    <html lang="en" className={`${bebas.variable} ${lexend.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f4f1ec]">
        <Nav user={user} />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  )
}
