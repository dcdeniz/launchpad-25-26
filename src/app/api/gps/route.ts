import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!process.env.GPS_INGEST_API_KEY || apiKey !== process.env.GPS_INGEST_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { vehicleId, lat, lng, timestamp, routeId } = await request.json()

    if (!vehicleId || lat == null || lng == null) {
      return NextResponse.json({ error: 'vehicleId, lat and lng are required' }, { status: 400 })
    }

    // In production: upsert into a vehicle_locations table
    console.log('[GPS]', { vehicleId, lat, lng, timestamp, routeId })

    return NextResponse.json({ received: true, timestamp: timestamp ?? new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
