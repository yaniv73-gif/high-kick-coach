import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Plus, Minus, SkipForward, ChevronRight, ChevronLeft, Repeat, AlertTriangle, Square } from 'lucide-react'
import type { WorkoutStep } from '../../lib/buildSteps'
import { useTimer } from '../../hooks/useTimer'
import { useWorkoutCues } from '../../hooks/useWorkoutCues'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { ExercisePlaceholder } from '../exercise-library/ExercisePlaceholder'
import { CATEGORY_LABELS_HE, DIFFICULTY_LABELS_HE, type ExerciseResultStatus } from '../../types'
import { formatDurationMinSec } from '../../lib/format'

export interface StepOutcome {
  status: ExerciseResultStatus
  repsCompleted?: number
  durationSecondsActual: number
}

interface ExerciseStepViewProps {
  step: WorkoutStep
  stepNumber: number
  totalSteps: number
  hasOtherSide: boolean
  hasPrevious: boolean
  painReportsCount: number
  onComplete: (outcome: StepOutcome) => void
  onSkip: () => void
  onBack: () => void
  onEndWorkout: () => void
  onOpenPain: () => void
}

export function ExerciseStepView({
  step,
  stepNumber,
  totalSteps,
  hasOtherSide,
  hasPrevious,
  painReportsCount,
  onComplete,
  onSkip,
  onBack,
  onEndWorkout,
  onOpenPain,
}: ExerciseStepViewProps) {
  const { exercise } = step
  const isTimeBased = step.durationSeconds !== undefined
  const cues = useWorkoutCues()
  const warnedRef = useRef(false)
  const startedRef = useRef(false)
  const [reps, setReps] = useState(0)

  const countdown = useTimer(step.durationSeconds ?? 0, {
    mode: 'down',
    onTick: (s) => {
      if (s <= 5 && s > 0 && !warnedRef.current) {
        warnedRef.current = true
        cues.cueWarning()
      }
    },
    onComplete: () => {
      cues.cueFinish()
      onComplete({ status: 'completed', durationSecondsActual: step.durationSeconds ?? 0 })
    },
  })

  const stopwatch = useTimer(0, { mode: 'up' })

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    cues.cueStart()
    if (isTimeBased) countdown.start()
    else stopwatch.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isRunning = isTimeBased ? countdown.isRunning : stopwatch.isRunning
  const togglePause = () => {
    if (isTimeBased) {
      if (countdown.isRunning) countdown.pause()
      else countdown.resume()
    } else {
      if (stopwatch.isRunning) stopwatch.pause()
      else stopwatch.resume()
    }
  }

  function finishNow() {
    const durationSecondsActual = isTimeBased ? (step.durationSeconds ?? 0) - countdown.seconds : stopwatch.seconds
    cues.cueFinish()
    onComplete({ status: 'completed', repsCompleted: !isTimeBased ? reps : undefined, durationSecondsActual })
  }

  const targetLabel = step.adaptedReps !== undefined ? `יעד: ${step.adaptedReps} חזרות` : undefined

  return (
    <div className="flex min-h-screen flex-col px-5 pt-6 pb-6 safe-top">
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
          <span>{step.sectionTitleHe}</span>
          <span>
            תרגיל {stepNumber} מתוך {totalSteps}
          </span>
        </div>
        <ProgressBar value={(stepNumber / totalSteps) * 100} showPercent={false} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <ExercisePlaceholder categories={exercise.categories} side={step.side} imageUrl={exercise.image} className="w-20 h-16 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight">{exercise.nameHe}</h1>
          <p className="text-text-muted text-xs">{exercise.categories.map((c) => CATEGORY_LABELS_HE[c]).join(' · ')}</p>
        </div>
      </div>

      {step.side && (
        <span className="self-start mb-3 rounded-full bg-brand/15 text-brand text-sm font-semibold px-3 py-1">
          צד {step.side === 'right' ? 'ימין' : 'שמאל'}
        </span>
      )}

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        {isTimeBased ? (
          <div className="text-7xl font-black tabular-nums tracking-tight" aria-live="polite">
            {formatDurationMinSec(countdown.seconds)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-7xl font-black tabular-nums" aria-live="polite">
              {reps}
            </div>
            {targetLabel && <p className="text-text-muted text-sm">{targetLabel}</p>}
            <div className="flex items-center gap-4">
              <button
                aria-label="הפחת חזרה"
                onClick={() => setReps((r) => Math.max(0, r - 1))}
                className="h-14 w-14 rounded-full bg-surface-2 border border-border flex items-center justify-center"
              >
                <Minus size={24} />
              </button>
              <button
                aria-label="הוסף חזרה"
                onClick={() => setReps((r) => r + 1)}
                className="h-14 w-14 rounded-full bg-brand text-white flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        )}
        {step.adaptedHoldSeconds !== undefined && (
          <p className="text-text-muted text-sm mt-3">החזקה: {step.adaptedHoldSeconds} שנ' בשיא הטווח</p>
        )}
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="text-text-muted">{exercise.description}</p>
        <ul className="space-y-1">
          {exercise.cues.slice(0, 4).map((cue) => (
            <li key={cue} className="flex gap-2">
              <span className="text-brand">•</span>
              <span>{cue}</span>
            </li>
          ))}
        </ul>
        {exercise.commonMistakes[0] && (
          <p className="flex items-start gap-2 text-warn">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden />
            <span>טעות נפוצה: {exercise.commonMistakes[0]}</span>
          </p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{DIFFICULTY_LABELS_HE[exercise.difficulty]}</span>
          {step.intensityNote && <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">{step.intensityNote}</span>}
        </div>
        <p className="text-xs text-text-muted">{step.weekLabelHe} · {step.supportNote}</p>
        {step.extraSetNote && <p className="text-xs text-brand">{step.extraSetNote}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button size="lg" variant="secondary" onClick={togglePause} aria-label={isRunning ? 'השהה' : 'המשך'}>
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'השהה' : 'המשך'}
        </Button>
        <Button size="lg" onClick={finishNow}>
          <Square size={18} />
          סיים תרגיל
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <Button size="md" variant="outline" disabled={!hasPrevious} onClick={onBack}>
          <ChevronRight size={18} />
          קודם
        </Button>
        {isTimeBased && (
          <Button size="md" variant="outline" onClick={() => countdown.addSeconds(10)}>
            10+ שנ'
          </Button>
        )}
        {hasOtherSide && (
          <Button size="md" variant="outline" onClick={finishNow}>
            <Repeat size={18} />
            החלף צד
          </Button>
        )}
        <Button size="md" variant="outline" onClick={onSkip} className={!isTimeBased && !hasOtherSide ? 'col-span-2' : ''}>
          <SkipForward size={18} />
          דלג
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button size="md" variant="outline" className="border-danger/50 text-danger" onClick={onOpenPain}>
          <AlertTriangle size={18} />
          כאב {painReportsCount > 0 ? `(${painReportsCount})` : ''}
        </Button>
        <Button size="md" variant="ghost" onClick={onEndWorkout}>
          <ChevronLeft size={18} />
          הפסק אימון
        </Button>
      </div>
    </div>
  )
}
