import { useState } from 'react'
import { HEIGHT_LANDMARK_LABELS_HE, type HeightMethodLandmark, type KickHeightValue } from '../../types'
import { cn } from '../../lib/cn'

const LANDMARKS = Object.keys(HEIGHT_LANDMARK_LABELS_HE) as HeightMethodLandmark[]

interface HeightInputProps {
  labelHe: string
  value: KickHeightValue
  onChange: (value: KickHeightValue) => void
}

export function HeightInput({ labelHe, value, onChange }: HeightInputProps) {
  const [method, setMethod] = useState<'landmark' | 'cm'>(value.cm !== undefined ? 'cm' : 'landmark')

  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm font-medium mb-1.5">{labelHe}</p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMethod('landmark')}
          className={cn('rounded-lg px-3 py-1.5 text-xs font-medium border', method === 'landmark' ? 'border-brand text-brand' : 'border-border text-text-muted')}
        >
          לפי נקודת ציון בגוף
        </button>
        <button
          onClick={() => setMethod('cm')}
          className={cn('rounded-lg px-3 py-1.5 text-xs font-medium border', method === 'cm' ? 'border-brand text-brand' : 'border-border text-text-muted')}
        >
          לפי סנטימטרים
        </button>
      </div>

      {method === 'landmark' ? (
        <div className="flex flex-wrap gap-2">
          {LANDMARKS.map((landmark) => (
            <button
              key={landmark}
              onClick={() => onChange({ landmark })}
              className={cn(
                'rounded-full border-2 px-3 py-1.5 text-sm font-medium',
                value.landmark === landmark ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
              )}
            >
              {HEIGHT_LANDMARK_LABELS_HE[landmark]}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={value.cm ?? ''}
            onChange={(e) => onChange({ cm: e.target.value ? Number(e.target.value) : undefined })}
            className="w-28 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
            placeholder="0"
          />
          <span className="text-sm text-text-muted">ס"מ</span>
        </div>
      )}
    </div>
  )
}
