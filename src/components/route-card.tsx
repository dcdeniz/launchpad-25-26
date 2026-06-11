import Link from 'next/link'

interface RouteCardProps {
  id: number
  name: string
  stopCount?: number
  firstStop?: string
  lastStop?: string
}

function getRouteIdentifier(name: string): string {
  const beforeDash = name.split(' — ')[0].trim()
  const parts = beforeDash.split(' ')
  return parts[parts.length - 1] ?? name.slice(0, 4)
}

function getBadgeColor(name: string): string {
  if (name.startsWith('Metro')) return 'bg-[#00a699]'
  if (name.startsWith('Train')) return 'bg-[#c0392b]'
  const id = getRouteIdentifier(name)
  if (id === '9')                   return 'bg-[#e63946]'
  if (id === '16')                  return 'bg-[#457b9d]'
  if (id === '82')                  return 'bg-[#2d6a4f]'
  if (id === '11A' || id === '11C') return 'bg-[#d97706]'
  if (id === '45')                  return 'bg-[#7c3aed]'
  if (id === '126')                 return 'bg-[#1e3a5f]'
  return 'bg-[#6b4c9a]'
}

export function RouteCard({ id, name, stopCount, firstStop, lastStop }: RouteCardProps) {
  const badgeColor = getBadgeColor(name)
  const num = getRouteIdentifier(name)

  return (
    <Link href={`/routes/${id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex items-stretch">
          {/* Route number badge */}
          <div className={`${badgeColor} flex items-center justify-center w-20 shrink-0`}>
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
