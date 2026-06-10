import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('roadworks')
      .select('*, stops(stop_name)')
      .order('start_date', { ascending: false })
      .limit(20)
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, stopId, startDate, endDate } = body

    if (!title || !startDate) {
      return NextResponse.json({ error: 'title and startDate are required' }, { status: 400 })
    }

    const { data, error } = await supabase.from('roadworks').insert({
      title,
      description: description ?? null,
      stop_id: stopId ?? null,
      start_date: startDate,
      end_date: endDate ?? null,
      reported_by: user.id,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
