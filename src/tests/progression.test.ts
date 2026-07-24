import { describe, expect, it } from 'vitest'
import { computeWeekAdaptation, getCurrentWeek, TOTAL_WEEKS } from '../lib/progression'
import { getExerciseById } from '../data/exercises'
import type { UserProfile } from '../types'

function makeProfile(startDaysAgo: number): UserProfile {
  const start = new Date()
  start.setDate(start.getDate() - startDaysAgo)
  return {
    id: 'test',
    weakSide: 'left',
    strongSide: 'right',
    programStartDate: start.toISOString().slice(0, 10),
  }
}

describe('getCurrentWeek', () => {
  it('is week 1 on day 0', () => {
    expect(getCurrentWeek(makeProfile(0))).toBe(1)
  })

  it('is week 1 through day 6', () => {
    expect(getCurrentWeek(makeProfile(6))).toBe(1)
  })

  it('rolls over to week 2 on day 7', () => {
    expect(getCurrentWeek(makeProfile(7))).toBe(2)
  })

  it('clamps at the final week after the program ends', () => {
    expect(getCurrentWeek(makeProfile(400))).toBe(TOTAL_WEEKS)
  })
})

describe('computeWeekAdaptation', () => {
  const strengthExercise = getExerciseById('strength-standing-leg-raise-front')!
  const kickExercise = getExerciseById('kick-free-technical')!

  it('keeps baseline reps and a 10s hold in weeks 1-2', () => {
    const adaptation = computeWeekAdaptation(strengthExercise, 1)
    expect(adaptation.reps).toBe(strengthExercise.reps)
    expect(adaptation.holdSeconds).toBe(10)
    expect(adaptation.extraSetNote).toBeUndefined()
  })

  it('adds 2 reps and extends the hold to 15s in weeks 3-4', () => {
    const adaptation = computeWeekAdaptation(strengthExercise, 3)
    expect(adaptation.reps).toBe(strengthExercise.reps! + 2)
    expect(adaptation.holdSeconds).toBe(15)
  })

  it('adds an explicit extra-set note from week 5 for the three named strength exercises', () => {
    const adaptation = computeWeekAdaptation(strengthExercise, 5)
    expect(adaptation.extraSetNote).toBeDefined()
  })

  it('reduces reps by roughly 20% in the week-7 deload', () => {
    const baseline = computeWeekAdaptation(strengthExercise, 4).reps!
    const week7 = computeWeekAdaptation(strengthExercise, 7).reps!
    expect(week7).toBeLessThan(baseline)
  })

  it('caps kick intensity at 40% in weeks 1-2', () => {
    const adaptation = computeWeekAdaptation(kickExercise, 1)
    expect(adaptation.intensityNote).toContain('40%')
  })

  it('mentions the 60-70% final test intensity in week 8', () => {
    const adaptation = computeWeekAdaptation(kickExercise, 8)
    expect(adaptation.intensityNote).toContain('60%')
  })
})
