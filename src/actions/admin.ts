'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Checks that the current user is authenticated and has the admin role.
// Redirects to login or dashboard if either check fails.
// Returns the authenticated Supabase client so callers can reuse it.
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')
  return supabase
}

// Inserts a new route and clears the cached routes pages so they reload.
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

// Deletes a route by ID. Cascade rules in the schema handle related records.
export async function deleteRoute(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('routes').delete().eq('id', id)
  revalidatePath('/admin/routes')
  revalidatePath('/routes')
}

// Inserts a new stop with optional GPS coordinates.
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

// Deletes a stop by ID.
export async function deleteStop(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('stops').delete().eq('id', id)
  revalidatePath('/admin/stops')
}

// Inserts a single timetable entry for a given route and stop.
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

// Deletes a single timetable entry by ID.
export async function deleteSchedule(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('schedules').delete().eq('id', id)
  revalidatePath('/admin/schedules')
}

// Inserts a new vehicle, optionally assigning it to a route.
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

// Deletes a vehicle by ID.
export async function deleteVehicle(id: number): Promise<void> {
  const supabase = await requireAdmin()
  await supabase.from('vehicles').delete().eq('id', id)
  revalidatePath('/admin/vehicles')
}
