import type { Exercise, UserProfile } from '../types'

export const TOTAL_WEEKS = 8

/** Ids of the three strength exercises that gain an explicit extra set from week 5 onward. */
const EXTRA_SET_EXERCISE_IDS = new Set([
  'strength-standing-leg-raise-front',
  'strength-side-leg-raise-support',
  'strength-chamber-hold',
])

export function getCurrentWeek(profile: UserProfile, now: Date = new Date()): number {
  const start = new Date(profile.programStartDate)
  const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const week = Math.floor(daysElapsed / 7) + 1
  return Math.min(Math.max(week, 1), TOTAL_WEEKS)
}

export interface WeekAdaptation {
  weekLabelHe: string
  reps?: number
  holdSeconds?: number
  supportNote: string
  intensityNote?: string
  extraSetNote?: string
}

function isKickExercise(exercise: Exercise): boolean {
  return exercise.categories.includes('kick-technique')
}

function isStrengthOrHold(exercise: Exercise): boolean {
  return exercise.categories.includes('strength') || exercise.holdSeconds !== undefined
}

export function computeWeekAdaptation(exercise: Exercise, week: number): WeekAdaptation {
  const baseReps = exercise.reps
  const baseHold = exercise.holdSeconds

  let reps = baseReps
  let holdSeconds = baseHold
  let supportNote = 'תמיכה מלאה בקיר או בכיסא, לפי הצורך.'
  let intensityNote: string | undefined = isKickExercise(exercise) ? 'עצימות בעיטות: עד 40%.' : undefined
  let extraSetNote: string | undefined
  let weekLabelHe = ''

  if (week <= 2) {
    weekLabelHe = 'שבועות 1–2 · לימוד התנועה'
    // baseline values as entered — low end of range, full support, 10s holds
    if (baseHold !== undefined) holdSeconds = 10
  } else if (week <= 4) {
    weekLabelHe = 'שבועות 3–4 · הוספת נפח'
    if (baseReps !== undefined) reps = baseReps + 2
    if (baseHold !== undefined) holdSeconds = 15
    if (isKickExercise(exercise)) intensityNote = 'עצימות בעיטות: מעט מעל 40%, יעד גובה עולה בהדרגה.'
  } else if (week <= 6) {
    weekLabelHe = 'שבועות 5–6 · פחות תמיכה'
    if (baseReps !== undefined) reps = baseReps + 2
    if (baseHold !== undefined) holdSeconds = 15
    supportNote = 'הפחת תמיכה ביד בהדרגה — נסה מגע קל בלבד בקיר.'
    if (isKickExercise(exercise)) intensityNote = 'עצימות בעיטות: שליטה בטווח חשובה מגובה מקסימלי.'
    if (isStrengthOrHold(exercise)) extraSetNote = 'שבוע זה מוסיפים סט שלישי לתרגיל.'
    if (exercise.id === 'strength-eccentric-lowering') supportNote += ' דגש על ירידה אקסצנטרית של 4–5 שניות.'
  } else if (week === 7) {
    weekLabelHe = 'שבוע 7 · עומס מתון'
    if (baseReps !== undefined) reps = Math.max(1, Math.round(baseReps * 0.8))
    if (baseHold !== undefined) holdSeconds = 15
    supportNote = 'תמיכה לפי הצורך בלבד — שבוע עומס מופחת.'
    if (isKickExercise(exercise)) intensityNote = 'אפשר לנסות טווח מעט גבוה יותר, אך לא בעצימות מקסימלית.'
    if (isStrengthOrHold(exercise)) extraSetNote = 'נפח מופחת בכ־20% השבוע.'
  } else {
    weekLabelHe = 'שבוע 8 · בדיקת התקדמות'
    if (baseReps !== undefined) reps = baseReps + 2
    if (baseHold !== undefined) holdSeconds = 15
    supportNote = 'תמיכה מינימלית — כפי שהתפתח מאז שבוע 5.'
    if (isKickExercise(exercise)) intensityNote = 'שמור על טכניקה נקייה; מבחן הגובה המסכם יהיה בעצימות 60%–70%.'
    if (isStrengthOrHold(exercise)) extraSetNote = 'חזרה לנפח של שבוע 6.'
  }

  if (EXTRA_SET_EXERCISE_IDS.has(exercise.id) && week >= 5) {
    extraSetNote = extraSetNote ?? 'שבוע זה מוסיפים סט שלישי לתרגיל.'
  }

  return { weekLabelHe, reps, holdSeconds, supportNote, intensityNote, extraSetNote }
}
