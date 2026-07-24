import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, TrendingUp, Dumbbell, Settings } from 'lucide-react'
import { cn } from '../../lib/cn'

const ITEMS = [
  { to: '/', label: 'בית', icon: Home, end: true },
  { to: '/plan', label: 'תכנית', icon: CalendarDays, end: false },
  { to: '/progress', label: 'התקדמות', icon: TrendingUp, end: false },
  { to: '/library', label: 'תרגילים', icon: Dumbbell, end: false },
  { to: '/settings', label: 'הגדרות', icon: Settings, end: false },
]

export function BottomNav() {
  return (
    <nav
      aria-label="ניווט ראשי"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-surface safe-bottom"
    >
      <ul className="flex items-stretch justify-around">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors',
                  isActive ? 'text-brand' : 'text-text-muted hover:text-text',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
