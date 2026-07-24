import * as ProgressPrimitive from '@radix-ui/react-progress'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  labelHe?: string
  showPercent?: boolean
}

export function ProgressBar({ value, className, labelHe, showPercent = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={className}>
      {(labelHe || showPercent) && (
        <div className="flex items-center justify-between mb-1.5 text-sm text-text-muted">
          {labelHe && <span>{labelHe}</span>}
          {showPercent && <span className="font-semibold text-text">{Math.round(clamped)}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        className="relative h-3 w-full overflow-hidden rounded-full bg-surface-2"
        value={clamped}
      >
        <ProgressPrimitive.Indicator
          className="h-full bg-brand transition-[width] duration-500 ease-out rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
