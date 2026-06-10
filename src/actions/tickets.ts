'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function purchaseTicket(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('tickets').insert({
    account_id: user.id,
    route_id: parseInt(formData.get('route_id') as string),
    vehicle_id: null,
    price: parseFloat(formData.get('price') as string),
    purchase_date: new Date().toISOString().split('T')[0],
  })

  if (error) return { error: error.message }
  revalidatePath('/tickets')
  return {}
}
