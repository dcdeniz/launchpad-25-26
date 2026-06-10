'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  return supabase
}

export async function createRoute(formData: FormData): Promise<{ error?: string }> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('routes').insert({
    route_name: formData.get('route_name') as string,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/routes')
  revalidatePath('/routes')
  return {}
}

export async function deleteRoute(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('routes').delete().eq('id', id)
  revalidatePath('/admin/routes')
  revalidatePath('/routes')
}

export async function createStop(formData: FormData): Promise<{ error?: string }> {
  const supabase = await requireAdmin()
  const lat = formData.get('lat') as string
  const lng = formData.get('lng') as string
  const { error } = await supabase.from('stops').insert({
    stop_name: formData.get('stop_name') as string,
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/stops')
  return {}
}

export async function deleteStop(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('stops').delete().eq('id', id)
  revalidatePath('/admin/stops')
}

export async function createSchedule(formData: FormData): Promise<{ error?: string }> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('schedules').insert({
    route_id: parseInt(formData.get('route_id') as string),
    stop_id: parseInt(formData.get('stop_id') as string),
    arrival_time: formData.get('arrival_time') as string,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/schedules')
  return {}
}

export async function deleteSchedule(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('schedules').delete().eq('id', id)
  revalidatePath('/admin/schedules')
}

export async function createVehicle(formData: FormData): Promise<{ error?: string }> {
  const supabase = await requireAdmin()
  const routeId = formData.get('route_id') as string
  const { error } = await supabase.from('vehicles').insert({
    vehicle_type: formData.get('vehicle_type') as string,
    route_id: routeId ? parseInt(routeId) : null,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/vehicles')
  return {}
}

export async function deleteVehicle(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('vehicles').delete().eq('id', id)
  revalidatePath('/admin/vehicles')
}
