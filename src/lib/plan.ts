import type { WeekSlot, WorkoutId, WorkoutSession, WorkoutStatus } from '../types'
import { TOTAL_WEEKS } from './progression'

export const WORKOUTS_PER_WEEK = 4
export const SLOT_WORKOUT_IDS: Record<WeekSlot, WorkoutId> = { 1: 'A', 2: 'B', 3: 'A', 4: 'B' }

export function getWorkoutIdForSlot(slot: WeekSlot): WorkoutId {
  return SLOT_WORKOUT_IDS[slot]
}

export function getSessionsForWeek(sessions: WorkoutSession[], week: number): WorkoutSession[] {
  return sessions.filter((s) => s.week === week)
}

/** Latest session recorded for a given week+slot (a slot can be retried). */
export function getSlotSession(sessions: WorkoutSession[], week: number, slot: WeekSlot): WorkoutSession | undefined {
  const candidates = sessions.filter((s) => s.week === week && s.slot === slot)
  if (candidates.length === 0) return undefined
  return candidates.reduce((latest, s) => (s.startedAt > latest.startedAt ? s : latest))
}

export function getSlotStatus(sessions: WorkoutSession[], week: number, slot: WeekSlot): WorkoutStatus {
  const session = getSlotSession(sessions, week, slot)
  if (!session) return 'not-started'
  if (session.status === 'in-progress') return 'not-started'
  return session.status as WorkoutStatus
}

export function getWeekCompletedCount(sessions: WorkoutSession[], week: number): number {
  const slots: WeekSlot[] = [1, 2, 3, 4]
  return slots.filter((slot) => getSlotStatus(sessions, week, slot) === 'completed').length
}

export interface NextWorkout {
  week: number
  slot: WeekSlot
  workoutId: WorkoutId
  isProgramComplete: boolean
}

export function getNextWorkout(sessions: WorkoutSession[], currentWeek: number): NextWorkout {
  const slots: WeekSlot[] = [1, 2, 3, 4]
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    for (const slot of slots) {
      const status = getSlotStatus(sessions, week, slot)
      if (status === 'not-started' || status === 'partial') {
        return { week, slot, workoutId: getWorkoutIdForSlot(slot), isProgramComplete: false }
      }
    }
  }
  return { week: currentWeek, slot: 1, workoutId: 'A', isProgramComplete: true }
}

export function getOverallCompletionPercent(sessions: WorkoutSession[]): number {
  const totalSlots = TOTAL_WEEKS * WORKOUTS_PER_WEEK
  let completed = 0
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    completed += getWeekCompletedCount(sessions, week)
  }
  return Math.round((completed / totalSlots) * 100)
}

/** Consecutive completed sessions counting back from the most recent one. */
export function getCurrentStreak(sessions: WorkoutSession[]): number {
  const ordered = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  let streak = 0
  for (const session of ordered) {
    if (session.status === 'completed') streak += 1
    else break
  }
  return streak
}

export function getLastWorkoutDate(sessions: WorkoutSession[]): string | undefined {
  const completed = sessions.filter((s) => s.status === 'completed' || s.status === 'partial')
  if (completed.length === 0) return undefined
  return completed.reduce((latest, s) => (s.date > latest.date ? s : latest)).date
}

export function estimateWorkoutMinutes(workoutId: WorkoutId): number {
  return workoutId === 'A' ? 24 : 24
}
