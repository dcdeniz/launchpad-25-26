import { NextRequest, NextResponse } from 'next/server'
import { mistral } from '@/lib/mistral'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { fromStopId, toStopId, time } = await request.json()

    let fromStop: any = null
    let toStop: any = null
    let schedules: any[] = []

    try {
      const supabase = await createClient()
      const { data: stops } = await supabase
        .from('stops').select('id, stop_name').in('id', [fromStopId, toStopId])
      fromStop = stops?.find(s => s.id === fromStopId)
      toStop   = stops?.find(s => s.id === toStopId)

      const requestedTime = time || '08:00'
      const hourPlusTwo = `${String(parseInt(requestedTime.split(':')[0]) + 2).padStart(2,'0')}:${requestedTime.split(':')[1]}`
      const { data } = await supabase
        .from('schedules')
        .select('arrival_time, routes(route_name), stops(stop_name)')
        .gte('arrival_time', requestedTime)
        .lte('arrival_time', hourPlusTwo)
        .order('arrival_time')
        .limit(12)
      schedules = data ?? []
    } catch { /* Supabase not configured */ }

    const from = fromStop?.stop_name ?? `Stop #${fromStopId}`
    const to   = toStop?.stop_name   ?? `Stop #${toStopId}`

    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful transport assistant for Ladywood, Birmingham, UK. Give concise, practical journey plans. Keep responses under 120 words.',
        },
        {
          role: 'user',
          content: `Plan a journey from "${from}" to "${to}" departing after ${time || '08:00'}.\n\nAvailable services: ${JSON.stringify(schedules.slice(0, 8))}`,
        },
      ],
    })

    const plan = (response.choices?.[0]?.message?.content as string) ?? 'Unable to plan journey at this time.'
    return NextResponse.json({ plan, fromStop: from, toStop: to })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to plan journey' }, { status: 500 })
  }
}
