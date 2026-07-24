import { cn } from '../../lib/cn'

interface RatingScaleProps {
  min: number
  max: number
  value: number | undefined
  onChange: (value: number) => void
  labelHe: string
  lowLabelHe?: string
  highLabelHe?: string
  id?: string
}

export function RatingScale({ min, max, value, onChange, labelHe, lowLabelHe, highLabelHe, id }: RatingScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className="py-2" role="group" aria-labelledby={id}>
      <p id={id} className="text-base font-medium mb-2">
        {labelHe}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            aria-label={`${labelHe}: ${n}`}
            onClick={() => onChange(n)}
            className={cn(
              'h-11 min-w-11 rounded-xl border-2 font-semibold transition-colors px-2',
              value === n ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2 text-text hover:border-brand',
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {(lowLabelHe || highLabelHe) && (
        <div className="flex justify-between mt-1.5 text-xs text-text-muted">
          <span>{lowLabelHe}</span>
          <span>{highLabelHe}</span>
        </div>
      )}
    </div>
  )
}
