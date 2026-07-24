import type { AppDataExport, WeeklyAssessment, WorkoutSession } from '../types'
import { getAllMediaMeta, getAllSessions, getAllWeeklyAssessments, importSessionsAndAssessments } from './db'
import { getProfile, getSettings } from './storage'

const APP_VERSION = '0.1.0'

export async function buildExportData(): Promise<AppDataExport> {
  const [sessions, weeklyAssessments, mediaMeta] = await Promise.all([
    getAllSessions(),
    getAllWeeklyAssessments(),
    getAllMediaMeta(),
  ])
  return {
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    settings: getSettings(),
    sessions,
    weeklyAssessments,
    mediaIndex: mediaMeta.map(({ blobKey: _blobKey, thumbnailBlobKey: _thumbnailBlobKey, ...rest }) => rest),
  }
}

function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function exportAsJson(): Promise<void> {
  const data = await buildExportData()
  triggerDownload(`high-kick-coach-${data.exportedAt.slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json')
}

function csvEscape(value: unknown): string {
  const str = value === undefined || value === null ? '' : String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export async function exportAsCsv(): Promise<void> {
  const sessions = await getAllSessions()
  const headers = [
    'date',
    'week',
    'slot',
    'workoutId',
    'status',
    'actualDurationSeconds',
    'effortRating',
    'painRating',
    'stabilityRating',
    'controlRating',
    'feltImprovement',
    'exercisesCompleted',
    'exercisesSkipped',
    'notes',
  ]
  const rows = sessions.map((s) =>
    [
      s.date,
      s.week,
      s.slot,
      s.workoutId,
      s.status,
      s.actualDurationSeconds,
      s.effortRating ?? '',
      s.painRating ?? '',
      s.stabilityRating ?? '',
      s.controlRating ?? '',
      s.feltImprovement ?? '',
      s.exerciseResults.filter((r) => r.status === 'completed').length,
      s.exerciseResults.filter((r) => r.status === 'skipped').length,
      s.notes ?? '',
    ]
      .map(csvEscape)
      .join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  triggerDownload(`high-kick-coach-sessions-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv')
}

export interface ImportResult {
  success: boolean
  message: string
}

export async function importFromJsonFile(file: File): Promise<ImportResult> {
  try {
    const text = await file.text()
    const data = JSON.parse(text) as Partial<AppDataExport>

    if (!Array.isArray(data.sessions) || !Array.isArray(data.weeklyAssessments)) {
      return { success: false, message: 'קובץ לא תקין: חסרים נתוני אימונים או בדיקות שבועיות.' }
    }

    await importSessionsAndAssessments(data.sessions as WorkoutSession[], data.weeklyAssessments as WeeklyAssessment[])

    if (data.settings) {
      localStorage.setItem('hkc:settings', JSON.stringify(data.settings))
    }
    if (data.profile) {
      localStorage.setItem('hkc:profile', JSON.stringify(data.profile))
    }

    return { success: true, message: 'הנתונים יובאו בהצלחה. רענן את האפליקציה כדי לראות את השינויים.' }
  } catch {
    return { success: false, message: 'שגיאה בקריאת הקובץ. ודא שזהו קובץ JSON תקין שיוצא מהאפליקציה.' }
  }
}
