import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Screen({ children, className, withNavPadding = true }: { children: ReactNode; className?: string; withNavPadding?: boolean }) {
  return (
    <div className={cn('min-h-screen safe-top', withNavPadding && 'pb-24', className)}>
      {children}
    </div>
  )
}

export function PageHeader({ titleHe, subtitleHe }: { titleHe: string; subtitleHe?: string }) {
  return (
    <header className="px-5 pt-6 pb-4">
      <h1 className="text-2xl font-bold">{titleHe}</h1>
      {subtitleHe && <p className="text-text-muted text-sm mt-1">{subtitleHe}</p>}
    </header>
  )
}
