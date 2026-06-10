import Link from 'next/link'

interface RouteCardProps {
  id: number
  name: string
  stopCount?: number
  firstStop?: string
  lastStop?: string
}

function getBadgeColor(name: string) {
  if (name.includes('9'))  return 'bg-[#e63946]'
  if (name.includes('16')) return 'bg-[#457b9d]'
  if (name.includes('82')) return 'bg-[#2d6a4f]'
  return 'bg-[#6b4c9a]'
}

function getRouteNumber(name: string) {
  const match = name.match(/\d+/)
  return match ? match[0] : name.slice(0, 2)
}

export function RouteCard({ id, name, stopCount, firstStop, lastStop }: RouteCardProps) {
  const badgeColor = getBadgeColor(name)
  const num = getRouteNumber(name)

  return (
    <Link href={`/routes/${id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex items-stretch">
          {/* Route number badge */}
          <div className={`${badgeColor} flex items-center justify-center w-16 shrink-0`}>
            <span className="font-display text-2xl text-white tracking-wider">{num}</span>
          </div>

          {/* Route info */}
          <div className="flex-1 p-4 min-w-0">
            <p className="font-semibold text-[#0b1f3a] text-sm truncate leading-tight">{name}</p>
            {firstStop && lastStop && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="truncate max-w-[120px]">{firstStop}</span>
                <span className="text-slate-300 shrink-0">→</span>
                <span className="truncate max-w-[120px]">{lastStop}</span>
              </div>
            )}
            {stopCount !== undefined && (
              <p className="mt-1.5 text-xs text-slate-400">{stopCount} stops</p>
            )}
          </div>

          {/* Arrow */}
          <div className="flex items-center pr-4 text-slate-300 group-hover:text-[#f5a623] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
