import type { Workout } from '../types'

const SAFETY_WARNING_HE = 'אין לעבוד לתוך כאב חד. המטרה היא שליטה ולא גובה בכל מחיר.'

export const WORKOUT_A: Workout = {
  id: 'A',
  nameHe: 'אימון A',
  totalDurationMinutes: 24,
  equipment: ['קיר לתמיכה', 'מזרן'],
  warningHe: SAFETY_WARNING_HE,
  sections: [
    {
      id: 'a-warmup',
      titleHe: 'חימום דינמי',
      exercises: [
        { exerciseId: 'warmup-skipping' },
        { exerciseId: 'warmup-leg-swings-fb' },
        { exerciseId: 'warmup-leg-swings-side' },
        { exerciseId: 'warmup-cossack-dynamic' },
      ],
    },
    {
      id: 'a-mobility',
      titleHe: 'מוביליטי אקטיבי',
      exercises: [
        { exerciseId: 'mobility-90-90-transitions' },
        { exerciseId: 'mobility-90-90-back-leg-lift' },
        { exerciseId: 'mobility-adductor-rock-back' },
        { exerciseId: 'mobility-hip-airplane' },
      ],
    },
    {
      id: 'a-strength',
      titleHe: 'חיזוק בטווח',
      exercises: [
        { exerciseId: 'strength-standing-leg-raise-front' },
        { exerciseId: 'strength-side-leg-raise-support' },
        { exerciseId: 'strength-chamber-hold' },
        { exerciseId: 'strength-chamber-extension' },
      ],
    },
    {
      id: 'a-kick-drills',
      titleHe: 'תרגילי בעיטה מול קיר',
      exercises: [
        { exerciseId: 'kick-pivot-drill' },
        { exerciseId: 'kick-slow-3-phase' },
        { exerciseId: 'kick-hold' },
        { exerciseId: 'kick-free-technical' },
      ],
    },
    {
      id: 'a-stretch',
      titleHe: 'מתיחות לסיום',
      exercises: [
        { exerciseId: 'stretch-hip-flexor-half-kneel' },
        { exerciseId: 'stretch-hamstring-half-split' },
        { exerciseId: 'stretch-frog' },
        { exerciseId: 'stretch-90-90-forward-lean' },
      ],
    },
  ],
}

export const WORKOUT_B: Workout = {
  id: 'B',
  nameHe: 'אימון B',
  totalDurationMinutes: 24,
  equipment: ['קיר לתמיכה', 'מזרן', 'קונוס או חפץ נמוך (אופציונלי)', 'רצועה או מגבת'],
  warningHe: SAFETY_WARNING_HE,
  sections: [
    {
      id: 'b-warmup',
      titleHe: 'חימום דינמי',
      exercises: [
        { exerciseId: 'warmup-knee-to-chest-walk' },
        { exerciseId: 'warmup-walking-straight-kicks' },
        { exerciseId: 'warmup-lateral-lunge-alt' },
        { exerciseId: 'warmup-pelvic-circles' },
        { exerciseId: 'warmup-light-middle-kick' },
      ],
    },
    {
      id: 'b-mobility',
      titleHe: 'מוביליטי אקטיבי',
      exercises: [
        { exerciseId: 'mobility-wgs-rotation' },
        { exerciseId: 'mobility-cossack-pause' },
        { exerciseId: 'mobility-heel-raise-straddle' },
        { exerciseId: 'mobility-internal-rotation-90-90' },
      ],
    },
    {
      id: 'b-strength',
      titleHe: 'חיזוק בטווח',
      exercises: [
        { exerciseId: 'strength-standing-knee-raise-obstacle' },
        { exerciseId: 'strength-side-lying-adductor-raise' },
        { exerciseId: 'strength-side-leg-raise-obstacle' },
        { exerciseId: 'strength-eccentric-lowering' },
      ],
    },
    {
      id: 'b-kick-drills',
      titleHe: 'תרגילי בעיטה עם תמיכה',
      exercises: [
        { exerciseId: 'kick-knee-up-pivot' },
        { exerciseId: 'kick-knee-up-pivot-extend' },
        { exerciseId: 'kick-over-marker' },
        { exerciseId: 'kick-double-no-foot-down' },
      ],
    },
    {
      id: 'b-stretch',
      titleHe: 'מתיחות לסיום',
      exercises: [
        { exerciseId: 'stretch-adductor-side-lunge' },
        { exerciseId: 'stretch-hamstring-strap' },
        { exerciseId: 'stretch-figure-four' },
        { exerciseId: 'stretch-butterfly' },
      ],
    },
  ],
}

export const WORKOUTS: Record<'A' | 'B', Workout> = { A: WORKOUT_A, B: WORKOUT_B }

export function getWorkout(id: 'A' | 'B'): Workout {
  return WORKOUTS[id]
}
