import type { PainSensation } from '../types'

export type PainGuidanceLevel = 'low' | 'moderate' | 'high' | 'urgent'

export interface PainGuidance {
  level: PainGuidanceLevel
  messageHe: string
}

const MEDICAL_DISCLAIMER_HE = 'האפליקציה אינה תחליף לבדיקה או ייעוץ של איש מקצוע רפואי.'

export function getPainGuidance(intensity: number, sensation: PainSensation): PainGuidance {
  const isUrgentSensation = sensation === 'sharp-pain' || sensation === 'joint-pinch'

  if (isUrgentSensation) {
    return {
      level: 'urgent',
      messageHe: `מומלץ להפסיק מיד את התרגיל. ${MEDICAL_DISCLAIMER_HE}`,
    }
  }
  if (intensity >= 6) {
    return { level: 'high', messageHe: `מומלץ להפסיק את התרגיל. ${MEDICAL_DISCLAIMER_HE}` }
  }
  if (intensity >= 4) {
    return { level: 'moderate', messageHe: `כדאי להקטין טווח או לדלג על התרגיל. ${MEDICAL_DISCLAIMER_HE}` }
  }
  return { level: 'low', messageHe: `אפשר להמשיך בזהירות. ${MEDICAL_DISCLAIMER_HE}` }
}

export { MEDICAL_DISCLAIMER_HE }
