import { useEffect } from 'react'
import { useTimer } from '../../hooks/useTimer'
import type { WorkoutStep } from '../../lib/buildSteps'

interface TransitionScreenProps {
  nextStep: WorkoutStep | null
  onDone: () => void
}

export function TransitionScreen({ nextStep, onDone }: TransitionScreenProps) {
  const timer = useTimer(3, { mode: 'down', onComplete: onDone })

  useEffect(() => {
    timer.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center safe-top">
      <p className="text-text-muted">{nextStep ? 'התרגיל הבא' : 'מסיים אימון'}</p>
      {nextStep && (
        <>
          <h2 className="text-2xl font-bold">{nextStep.exercise.nameHe}</h2>
          {nextStep.side && (
            <span className="rounded-full bg-brand/15 text-brand text-sm font-semibold px-3 py-1">
              צד {nextStep.side === 'right' ? 'ימין' : 'שמאל'}
            </span>
          )}
        </>
      )}
      <div className="text-7xl font-black tabular-nums text-brand" aria-live="polite">
        {timer.seconds}
      </div>
    </div>
  )
}
