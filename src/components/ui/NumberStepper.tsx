import { Minus, Plus } from 'lucide-react'

interface NumberStepperProps {
  labelHe: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  suffixHe?: string
}

export function NumberStepper({ labelHe, value, onChange, step = 1, min = 0, suffixHe }: NumberStepperProps) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm font-medium mb-1.5">{labelHe}</p>
      <div className="flex items-center gap-3">
        <button
          aria-label="הפחת"
          onClick={() => onChange(Math.max(min, value - step))}
          className="h-11 w-11 rounded-full bg-surface-2 border border-border flex items-center justify-center"
        >
          <Minus size={18} />
        </button>
        <span className="text-2xl font-bold tabular-nums w-16 text-center">
          {value}
          {suffixHe && <span className="text-sm text-text-muted"> {suffixHe}</span>}
        </span>
        <button
          aria-label="הוסף"
          onClick={() => onChange(value + step)}
          className="h-11 w-11 rounded-full bg-brand text-white flex items-center justify-center"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
