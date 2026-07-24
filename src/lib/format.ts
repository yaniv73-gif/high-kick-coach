import { HEIGHT_LANDMARK_LABELS_HE, type KickHeightValue } from '../types'

export function formatKickHeight(value: KickHeightValue | undefined): string {
  if (!value) return '—'
  if (value.cm !== undefined) return `${value.cm} ס"מ`
  if (value.landmark) return HEIGHT_LANDMARK_LABELS_HE[value.landmark]
  return '—'
}

export function formatDateHe(iso: string | undefined): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

export function formatDurationMinSec(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatMinutes(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60)
  return `${minutes} דק'`
}
