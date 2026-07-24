import type { HeightMethodLandmark, KickHeightValue, WeeklyAssessment, WorkoutSession } from '../types'
import { TOTAL_WEEKS } from './progression'

const LANDMARK_ORDER: Record<HeightMethodLandmark, number> = {
  belt: 20,
  ribs: 40,
  chest: 60,
  shoulder: 80,
  neck: 100,
  head: 120,
  'above-head': 140,
}

/**
 * Approximate cm-equivalent so landmark- and cm-based entries can share one axis.
 * TODO(future): replace with a real per-user calibration once body height is captured.
 */
export function heightToChartValue(value: KickHeightValue | undefined): number | null {
  if (!value) return null
  if (value.cm !== undefined) return value.cm
  if (value.landmark) return LANDMARK_ORDER[value.landmark]
  return null
}

export function buildWeeklySessionsData(sessions: WorkoutSession[]) {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => {
    const week = i + 1
    const weekSessions = sessions.filter((s) => s.week === week)
    return {
      week: `ש${week}`,
      completed: weekSessions.filter((s) => s.status === 'completed').length,
      minutes: Math.round(weekSessions.reduce((sum, s) => sum + s.actualDurationSeconds, 0) / 60),
    }
  })
}

export function buildRatingsTimeline(sessions: WorkoutSession[]) {
  return [...sessions]
    .filter((s) => s.status !== 'in-progress')
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s, i) => ({
      index: i + 1,
      date: s.date,
      effort: s.effortRating ?? null,
      pain: s.painRating ?? null,
      stability: s.stabilityRating ?? null,
      control: s.controlRating ?? null,
    }))
}

export function buildKickHeightTimeline(assessments: WeeklyAssessment[]) {
  return [...assessments]
    .sort((a, b) => a.week - b.week)
    .map((a) => ({
      week: `ש${a.week}`,
      right: heightToChartValue(a.kickHeightRight),
      left: heightToChartValue(a.kickHeightLeft),
      diff:
        heightToChartValue(a.kickHeightRight) !== null && heightToChartValue(a.kickHeightLeft) !== null
          ? Math.abs((heightToChartValue(a.kickHeightRight) ?? 0) - (heightToChartValue(a.kickHeightLeft) ?? 0))
          : null,
    }))
}

export function buildHoldTimeTimeline(assessments: WeeklyAssessment[]) {
  return [...assessments]
    .sort((a, b) => a.week - b.week)
    .map((a) => ({
      week: `ש${a.week}`,
      right: a.holdTimeRightSeconds,
      left: a.holdTimeLeftSeconds,
    }))
}

export function getAssessmentForWeek(assessments: WeeklyAssessment[], week: number) {
  return assessments.find((a) => a.week === week)
}
