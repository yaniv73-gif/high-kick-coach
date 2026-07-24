import { describe, expect, it } from 'vitest'
import {
  getCurrentStreak,
  getNextWorkout,
  getOverallCompletionPercent,
  getSlotStatus,
  getWeekCompletedCount,
} from '../lib/plan'
import type { WorkoutSession } from '../types'

function makeSession(overrides: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: overrides.id ?? Math.random().toString(36),
    workoutId: 'A',
    week: 1,
    slot: 1,
    date: '2026-01-01',
    startedAt: '2026-01-01T10:00:00.000Z',
    completedAt: '2026-01-01T10:24:00.000Z',
    actualDurationSeconds: 1440,
    status: 'completed',
    exerciseResults: [],
    skippedExerciseIds: [],
    mediaIds: [],
    ...overrides,
  }
}

describe('getSlotStatus / getWeekCompletedCount', () => {
  it('reports not-started when no session exists for a slot', () => {
    expect(getSlotStatus([], 1, 1)).toBe('not-started')
  })

  it('reports the status of the latest session for that slot', () => {
    const sessions = [
      makeSession({ id: 'a', week: 1, slot: 1, status: 'skipped', startedAt: '2026-01-01T10:00:00.000Z' }),
      makeSession({ id: 'b', week: 1, slot: 1, status: 'completed', startedAt: '2026-01-02T10:00:00.000Z' }),
    ]
    expect(getSlotStatus(sessions, 1, 1)).toBe('completed')
  })

  it('counts only completed slots for the week', () => {
    const sessions = [
      makeSession({ id: 'a', week: 2, slot: 1, status: 'completed' }),
      makeSession({ id: 'b', week: 2, slot: 2, status: 'partial' }),
      makeSession({ id: 'c', week: 2, slot: 3, status: 'skipped' }),
    ]
    expect(getWeekCompletedCount(sessions, 2)).toBe(1)
  })
})

describe('getNextWorkout', () => {
  it('suggests slot 1 of week 1 when nothing has been done', () => {
    const next = getNextWorkout([], 1)
    expect(next).toEqual({ week: 1, slot: 1, workoutId: 'A', isProgramComplete: false })
  })

  it('suggests the next open slot after some are completed', () => {
    const sessions = [
      makeSession({ id: 'a', week: 1, slot: 1, status: 'completed' }),
      makeSession({ id: 'b', week: 1, slot: 2, status: 'completed' }),
    ]
    const next = getNextWorkout(sessions, 1)
    expect(next).toEqual({ week: 1, slot: 3, workoutId: 'A', isProgramComplete: false })
  })

  it('flags the program complete once all 32 slots are done', () => {
    const sessions: WorkoutSession[] = []
    for (let week = 1; week <= 8; week++) {
      for (let slot = 1; slot <= 4; slot++) {
        sessions.push(makeSession({ id: `${week}-${slot}`, week, slot: slot as 1 | 2 | 3 | 4, status: 'completed' }))
      }
    }
    expect(getNextWorkout(sessions, 8).isProgramComplete).toBe(true)
    expect(getOverallCompletionPercent(sessions)).toBe(100)
  })
})

describe('getCurrentStreak', () => {
  it('counts consecutive completed sessions from the most recent one', () => {
    const sessions = [
      makeSession({ id: 'a', status: 'completed', startedAt: '2026-01-01T10:00:00.000Z' }),
      makeSession({ id: 'b', status: 'completed', startedAt: '2026-01-02T10:00:00.000Z' }),
      makeSession({ id: 'c', status: 'skipped', startedAt: '2026-01-03T10:00:00.000Z' }),
      makeSession({ id: 'd', status: 'completed', startedAt: '2026-01-04T10:00:00.000Z' }),
    ]
    expect(getCurrentStreak(sessions)).toBe(1)
  })

  it('is 0 when the most recent session was not completed', () => {
    const sessions = [makeSession({ status: 'skipped' })]
    expect(getCurrentStreak(sessions)).toBe(0)
  })
})
