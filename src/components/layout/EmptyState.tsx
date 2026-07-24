import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  titleHe: string
  descriptionHe?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, titleHe, descriptionHe, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="rounded-full bg-surface-2 p-4">
        <Icon size={28} className="text-text-muted" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold">{titleHe}</h3>
      {descriptionHe && <p className="text-text-muted max-w-xs text-sm">{descriptionHe}</p>}
      {action}
    </div>
  )
}
