export type Role = 'resident' | 'admin'

export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: Role
}

export interface Route {
  id: number
  route_name: string
}

export interface Stop {
  id: number
  stop_name: string
  lat: number | null
  lng: number | null
}

export interface RouteStop {
  route_id: number
  stop_id: number
  stop_order: number
  stops?: Stop
}

export interface Schedule {
  id: number
  route_id: number
  stop_id: number
  arrival_time: string
  routes?: Route
  stops?: Stop
}

export interface Vehicle {
  id: number
  vehicle_type: string
  route_id: number | null
  routes?: Route
}

export interface Ticket {
  id: number
  account_id: string
  route_id: number | null
  vehicle_id: number | null
  price: number
  purchase_date: string
  routes?: Route
  vehicles?: Vehicle
}

export interface Roadwork {
  id: number
  title: string
  description: string | null
  stop_id: number | null
  start_date: string
  end_date: string | null
  reported_by: string | null
  created_at: string
  stops?: Stop
}
