import { useState } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { RatingScale } from '../ui/RatingScale'
import { cn } from '../../lib/cn'
import { getPainGuidance } from '../../lib/pain'
import {
  PAIN_LOCATION_LABELS_HE,
  PAIN_SENSATION_LABELS_HE,
  type PainLocation,
  type PainReport,
  type PainSensation,
} from '../../types'
import { createId } from '../../lib/id'

const LOCATIONS = Object.keys(PAIN_LOCATION_LABELS_HE) as PainLocation[]
const SENSATIONS = Object.keys(PAIN_SENSATION_LABELS_HE) as PainSensation[]

interface PainModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (report: PainReport) => void
  exerciseId?: string
}

export function PainModal({ open, onOpenChange, onSubmit, exerciseId }: PainModalProps) {
  const [location, setLocation] = useState<PainLocation | null>(null)
  const [sensation, setSensation] = useState<PainSensation | null>(null)
  const [intensity, setIntensity] = useState<number | undefined>(undefined)

  const guidance = intensity !== undefined && sensation ? getPainGuidance(intensity, sensation) : null

  function reset() {
    setLocation(null)
    setSensation(null)
    setIntensity(undefined)
  }

  function handleSubmit() {
    if (!location || !sensation || intensity === undefined) return
    onSubmit({ id: createId(), timestamp: new Date().toISOString(), exerciseId, location, sensation, intensity })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
      titleHe="כאב או אי-נוחות"
    >
      <div className="space-y-5">
        <div>
          <p className="text-base font-medium mb-2">מיקום הכאב</p>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={cn(
                  'rounded-full border-2 px-3 py-2 text-sm font-medium',
                  location === loc ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
                )}
              >
                {PAIN_LOCATION_LABELS_HE[loc]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-base font-medium mb-2">סוג התחושה</p>
          <div className="flex flex-wrap gap-2">
            {SENSATIONS.map((sen) => (
              <button
                key={sen}
                onClick={() => setSensation(sen)}
                className={cn(
                  'rounded-full border-2 px-3 py-2 text-sm font-medium',
                  sensation === sen ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
                )}
              >
                {PAIN_SENSATION_LABELS_HE[sen]}
              </button>
            ))}
          </div>
        </div>

        <RatingScale
          min={0}
          max={10}
          value={intensity}
          onChange={setIntensity}
          labelHe="עוצמה"
          lowLabelHe="0 · ללא"
          highLabelHe="10 · חמור מאוד"
        />

        {guidance && (
          <div
            className={cn(
              'flex items-start gap-2 rounded-xl p-3 text-sm border',
              guidance.level === 'urgent' || guidance.level === 'high'
                ? 'border-danger/40 bg-danger/10 text-danger'
                : guidance.level === 'moderate'
                  ? 'border-warn/40 bg-warn/10 text-warn'
                  : 'border-ok/40 bg-ok/10 text-ok',
            )}
          >
            <AlertOctagon size={18} className="shrink-0 mt-0.5" aria-hidden />
            <p>{guidance.messageHe}</p>
          </div>
        )}

        <Button fullWidth size="lg" disabled={!location || !sensation || intensity === undefined} onClick={handleSubmit}>
          שמור דיווח
        </Button>
      </div>
    </Dialog>
  )
}
