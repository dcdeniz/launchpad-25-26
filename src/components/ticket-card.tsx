interface TicketCardProps {
  id: number
  routeName: string
  price: number
  purchaseDate: string
  vehicleType?: string
}

// Returns a background colour for the ticket header based on route number.
function getBadgeColor(name: string) {
  if (name.includes('9'))  return 'bg-[#e63946]'
  if (name.includes('16')) return 'bg-[#457b9d]'
  if (name.includes('82')) return 'bg-[#2d6a4f]'
  return 'bg-[#6b4c9a]'
}

// Extracts the route identifier from the full route name string.
function getRouteNumber(name: string) {
  const match = name.match(/\d+/)
  return match ? match[0] : name.slice(0, 2)
}

export function TicketCard({ id, routeName, price, purchaseDate, vehicleType }: TicketCardProps) {
  const badgeColor = getBadgeColor(routeName)
  const num = getRouteNumber(routeName)
  const date = new Date(purchaseDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Ticket header with route colour, number, and price */}
      <div className={`${badgeColor} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="font-display text-xl text-white tracking-wider">{num}</span>
          <span className="text-white/80 text-xs font-medium truncate">{routeName.split('—')[1]?.trim()}</span>
        </div>
        <span className="text-white font-mono text-sm font-semibold">£{price.toFixed(2)}</span>
      </div>

      {/* Perforated tear line between the header and body */}
      <div className="relative">
        <div className="absolute -top-0 inset-x-0 flex justify-between px-2">
          <span className="w-3 h-3 rounded-full bg-[#f4f1ec] -translate-y-1/2" />
          <span className="w-3 h-3 rounded-full bg-[#f4f1ec] -translate-y-1/2" />
        </div>
        <div className="border-t border-dashed border-slate-200 mx-3" />
      </div>

      {/* Ticket body with purchase date, vehicle type, and reference number */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Purchased</p>
          <p className="text-sm text-slate-700 font-medium font-mono">{date}</p>
        </div>
        {vehicleType && (
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Vehicle</p>
            <p className="text-xs text-slate-600">{vehicleType}</p>
          </div>
        )}
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ref</p>
          <p className="text-xs text-slate-500 font-mono">#{String(id).padStart(6, '0')}</p>
        </div>
      </div>
    </div>
  )
}
