import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MediaItem, WeeklyAssessment, WorkoutSession } from '../types'

interface HighKickDB extends DBSchema {
  sessions: {
    key: string
    value: WorkoutSession
    indexes: { 'by-week': number; 'by-date': string }
  }
  weeklyAssessments: {
    key: string
    value: WeeklyAssessment
    indexes: { 'by-week': number }
  }
  mediaMeta: {
    key: string
    value: MediaItem
    indexes: { 'by-createdAt': string }
  }
  mediaBlobs: {
    key: string
    value: { id: string; blob: Blob }
  }
}

const DB_NAME = 'high-kick-coach-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<HighKickDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<HighKickDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const sessions = db.createObjectStore('sessions', { keyPath: 'id' })
        sessions.createIndex('by-week', 'week')
        sessions.createIndex('by-date', 'date')

        const assessments = db.createObjectStore('weeklyAssessments', { keyPath: 'id' })
        assessments.createIndex('by-week', 'week')

        const mediaMeta = db.createObjectStore('mediaMeta', { keyPath: 'id' })
        mediaMeta.createIndex('by-createdAt', 'createdAt')

        db.createObjectStore('mediaBlobs', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

// ---------- Sessions ----------
export async function saveSession(session: WorkoutSession): Promise<void> {
  const db = await getDb()
  await db.put('sessions', session)
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const db = await getDb()
  const all = await db.getAll('sessions')
  return all.sort((a, b) => a.date.localeCompare(b.date))
}

export async function getSession(id: string): Promise<WorkoutSession | undefined> {
  const db = await getDb()
  return db.get('sessions', id)
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('sessions', id)
}

// ---------- Weekly assessments ----------
export async function saveWeeklyAssessment(assessment: WeeklyAssessment): Promise<void> {
  const db = await getDb()
  await db.put('weeklyAssessments', assessment)
}

export async function getAllWeeklyAssessments(): Promise<WeeklyAssessment[]> {
  const db = await getDb()
  const all = await db.getAll('weeklyAssessments')
  return all.sort((a, b) => a.week - b.week)
}

// ---------- Media ----------
export async function saveMedia(meta: MediaItem, blob?: Blob): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(['mediaMeta', 'mediaBlobs'], 'readwrite')
  await tx.objectStore('mediaMeta').put(meta)
  if (blob) {
    await tx.objectStore('mediaBlobs').put({ id: meta.id, blob })
  }
  await tx.done
}

export async function getAllMediaMeta(): Promise<MediaItem[]> {
  const db = await getDb()
  const all = await db.getAll('mediaMeta')
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getMediaBlob(id: string): Promise<Blob | undefined> {
  const db = await getDb()
  const record = await db.get('mediaBlobs', id)
  return record?.blob
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(['mediaMeta', 'mediaBlobs'], 'readwrite')
  await tx.objectStore('mediaMeta').delete(id)
  await tx.objectStore('mediaBlobs').delete(id)
  await tx.done
}

// ---------- Bulk / reset ----------
export async function clearAllIndexedData(): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(['sessions', 'weeklyAssessments', 'mediaMeta', 'mediaBlobs'], 'readwrite')
  await Promise.all([
    tx.objectStore('sessions').clear(),
    tx.objectStore('weeklyAssessments').clear(),
    tx.objectStore('mediaMeta').clear(),
    tx.objectStore('mediaBlobs').clear(),
  ])
  await tx.done
}

export async function importSessionsAndAssessments(
  sessions: WorkoutSession[],
  assessments: WeeklyAssessment[],
): Promise<void> {
  const db = await getDb()
  const tx = db.transaction(['sessions', 'weeklyAssessments'], 'readwrite')
  await Promise.all([
    ...sessions.map((s) => tx.objectStore('sessions').put(s)),
    ...assessments.map((a) => tx.objectStore('weeklyAssessments').put(a)),
  ])
  await tx.done
}
