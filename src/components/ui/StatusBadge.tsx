import { CheckCircle2, CircleDashed, CircleSlash, MinusCircle } from 'lucide-react'
import type { WorkoutStatus } from '../../types'
import { cn } from '../../lib/cn'

const STATUS_CONFIG: Record<WorkoutStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  'not-started': { label: 'לא התחיל', icon: CircleDashed, className: 'text-text-muted' },
  completed: { label: 'הושלם', icon: CheckCircle2, className: 'text-ok' },
  partial: { label: 'הושלם חלקית', icon: MinusCircle, className: 'text-warn' },
  skipped: { label: 'דולג', icon: CircleSlash, className: 'text-danger' },
}

export function StatusBadge({ status, className }: { status: WorkoutStatus; className?: string }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', config.className, className)}>
      <Icon size={16} aria-hidden />
      {config.label}
    </span>
  )
}
