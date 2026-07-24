import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WorkoutIntro } from '../components/workout/WorkoutIntro'
import { ExerciseStepView, type StepOutcome } from '../components/workout/ExerciseStepView'
import { TransitionScreen } from '../components/workout/TransitionScreen'
import { PainModal } from '../components/workout/PainModal'
import { getWorkout } from '../data/workouts'
import { buildWorkoutSteps } from '../lib/buildSteps'
import { useAppState } from '../store/AppStateContext'
import { useWakeLock } from '../hooks/useWakeLock'
import { saveSession } from '../lib/db'
import { createId } from '../lib/id'
import type { ExerciseResult, PainReport, WeekSlot, WorkoutId, WorkoutSession } from '../types'

type Phase = 'intro' | 'running' | 'transition' | 'saving'

export function ActiveWorkout() {
  const { workoutId, week: weekParam, slot: slotParam } = useParams()
  const navigate = useNavigate()
  const { settings } = useAppState()

  const week = Number(weekParam)
  const slot = Number(slotParam) as WeekSlot
  const workout = getWorkout((workoutId as WorkoutId) ?? 'A')

  const steps = useMemo(() => buildWorkoutSteps(workout, week, slot, settings), [workout, week, slot, settings])

  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [painModalOpen, setPainModalOpen] = useState(false)
  const [currentStepPain, setCurrentStepPain] = useState<PainReport[]>([])

  const resultsRef = useRef<ExerciseResult[]>([])
  const sessionIdRef = useRef(createId())
  const startedAtRef = useRef<string | null>(null)

  useWakeLock(settings.keepScreenOn && phase !== 'intro')

  const requestFullscreen = useCallback(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen().catch(() => undefined)
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => undefined)
    }
  }, [])

  const finishWorkout = useCallback(
    async (status: WorkoutSession['status']) => {
      exitFullscreen()
      const startedAt = startedAtRef.current ?? new Date().toISOString()
      const actualDurationSeconds = Math.round((Date.now() - new Date(startedAt).getTime()) / 1000)
      const skippedExerciseIds = resultsRef.current.filter((r) => r.status === 'skipped').map((r) => r.exerciseId)

      const session: WorkoutSession = {
        id: sessionIdRef.current,
        workoutId: workout.id,
        week,
        slot,
        date: startedAt.slice(0, 10),
        startedAt,
        completedAt: new Date().toISOString(),
        actualDurationSeconds,
        status,
        exerciseResults: resultsRef.current,
        skippedExerciseIds,
        mediaIds: [],
      }
      await saveSession(session)
      navigate(`/summary/${session.id}`, { replace: true })
    },
    [exitFullscreen, navigate, slot, week, workout.id],
  )

  const handleStart = useCallback(() => {
    startedAtRef.current = new Date().toISOString()
    requestFullscreen()
    setPhase('running')
  }, [requestFullscreen])

  function recordResult(outcome: StepOutcome) {
    const step = steps[stepIndex]
    resultsRef.current = [
      ...resultsRef.current,
      {
        exerciseId: step.exercise.id,
        order: stepIndex,
        status: outcome.status,
        side: step.side,
        repsCompleted: outcome.repsCompleted,
        durationSecondsActual: outcome.durationSecondsActual,
        painReports: currentStepPain.length > 0 ? currentStepPain : undefined,
      },
    ]
    setCurrentStepPain([])
  }

  function advanceOrFinish() {
    if (stepIndex >= steps.length - 1) {
      setPhase('saving')
      finishWorkout('completed')
    } else {
      setPhase('transition')
    }
  }

  function handleStepComplete(outcome: StepOutcome) {
    recordResult(outcome)
    advanceOrFinish()
  }

  function handleSkip() {
    const step = steps[stepIndex]
    resultsRef.current = [
      ...resultsRef.current,
      { exerciseId: step.exercise.id, order: stepIndex, status: 'skipped', side: step.side },
    ]
    setCurrentStepPain([])
    advanceOrFinish()
  }

  function handleTransitionDone() {
    setStepIndex((i) => i + 1)
    setPhase('running')
  }

  function handleBack() {
    if (stepIndex === 0) return
    resultsRef.current = resultsRef.current.slice(0, -1)
    setCurrentStepPain([])
    setStepIndex((i) => i - 1)
  }

  function handleEndWorkout() {
    const hasAnyProgress = resultsRef.current.some((r) => r.status === 'completed')
    setPhase('saving')
    finishWorkout(hasAnyProgress ? 'partial' : 'skipped')
  }

  if (phase === 'intro') {
    return <WorkoutIntro workout={workout} week={week} onStart={handleStart} />
  }

  if (phase === 'saving') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">שומר את האימון...</p>
      </div>
    )
  }

  if (phase === 'transition') {
    return <TransitionScreen nextStep={steps[stepIndex + 1] ?? null} onDone={handleTransitionDone} />
  }

  const currentStep = steps[stepIndex]
  const otherSideExists =
    currentStep.isPerSide &&
    steps.some((s, i) => i !== stepIndex && s.exercise.id === currentStep.exercise.id && s.side !== currentStep.side)

  return (
    <>
      <ExerciseStepView
        key={currentStep.key}
        step={currentStep}
        stepNumber={stepIndex + 1}
        totalSteps={steps.length}
        hasOtherSide={otherSideExists}
        hasPrevious={stepIndex > 0}
        painReportsCount={currentStepPain.length}
        onComplete={handleStepComplete}
        onSkip={handleSkip}
        onBack={handleBack}
        onEndWorkout={handleEndWorkout}
        onOpenPain={() => setPainModalOpen(true)}
      />
      <PainModal
        open={painModalOpen}
        onOpenChange={setPainModalOpen}
        exerciseId={currentStep.exercise.id}
        onSubmit={(report) => setCurrentStepPain((prev) => [...prev, report])}
      />
    </>
  )
}
