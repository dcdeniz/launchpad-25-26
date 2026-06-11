'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Creates a new account and redirects to the dashboard on success.
// The trigger in migration 0001 automatically creates a matching profiles row.
export async function signUp(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
      },
    },
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

// Signs in with email and password, redirects to the dashboard on success.
export async function signIn(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/dashboard')
}

// Clears the session and sends the user to the login page.
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
