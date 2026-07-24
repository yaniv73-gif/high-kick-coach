import type { AppSettings, Exercise, Side, Workout } from '../types'
import { getExerciseById, FINAL_HIGH_KICK_TEST_ID } from '../data/exercises'
import { computeWeekAdaptation } from './progression'

export interface WorkoutStep {
  key: string
  sectionTitleHe: string
  exercise: Exercise
  side?: Side
  isPerSide: boolean
  adaptedReps?: number
  adaptedHoldSeconds?: number
  durationSeconds?: number
  supportNote: string
  intensityNote?: string
  extraSetNote?: string
  weekLabelHe: string
}

function otherSide(side: Side): Side {
  return side === 'right' ? 'left' : 'right'
}

function buildStepsForExercise(
  exercise: Exercise,
  sectionTitleHe: string,
  week: number,
  settings: AppSettings,
): WorkoutStep[] {
  const adaptation = computeWeekAdaptation(exercise, week)
  const isPerSide = exercise.durationType === 'time-per-side' || exercise.durationType === 'reps-per-side'
  const isTimeBased = exercise.durationType === 'time' || exercise.durationType === 'time-per-side'

  const base = {
    sectionTitleHe,
    exercise,
    isPerSide,
    adaptedReps: adaptation.reps,
    adaptedHoldSeconds: adaptation.holdSeconds,
    durationSeconds: isTimeBased ? exercise.durationSeconds : undefined,
    supportNote: adaptation.supportNote,
    intensityNote: adaptation.intensityNote,
    extraSetNote: adaptation.extraSetNote,
    weekLabelHe: adaptation.weekLabelHe,
  }

  if (!isPerSide) {
    return [{ ...base, key: exercise.id }]
  }

  const firstSide: Side = settings.startWithWeakSide ? settings.weakSide : otherSide(settings.weakSide)
  const secondSide = otherSide(firstSide)

  return [
    { ...base, key: `${exercise.id}-${firstSide}`, side: firstSide },
    { ...base, key: `${exercise.id}-${secondSide}`, side: secondSide },
  ]
}

export function buildWorkoutSteps(
  workout: Workout,
  week: number,
  slot: number,
  settings: AppSettings,
): WorkoutStep[] {
  const steps: WorkoutStep[] = []
  for (const section of workout.sections) {
    for (const ref of section.exercises) {
      const exercise = getExerciseById(ref.exerciseId)
      if (!exercise) continue
      steps.push(...buildStepsForExercise(exercise, section.titleHe, week, settings))
    }
  }

  const isFinalTestWorkout = week === 8 && workout.id === 'A' && (slot === 1 || slot === 3)
  if (isFinalTestWorkout) {
    const finalExercise = getExerciseById(FINAL_HIGH_KICK_TEST_ID)
    if (finalExercise) {
      steps.push(...buildStepsForExercise(finalExercise, 'מבחן סיום', week, settings))
    }
  }

  return steps
}
