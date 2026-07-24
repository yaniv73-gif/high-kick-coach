// Core data model for High Kick Coach.
// TODO(future): every persisted record carries optional `syncStatus` / `remoteId`
// fields so a later Supabase sync layer can be bolted on without a schema migration.

export type Side = 'right' | 'left'
export type SideOrBoth = Side | 'both'

export type WorkoutId = 'A' | 'B'

/** Position of a workout inside the 4-workout weekly cycle: A, B, A, B */
export type WeekSlot = 1 | 2 | 3 | 4

export type WorkoutStatus = 'not-started' | 'completed' | 'partial' | 'skipped'

export type Difficulty = 'easy' | 'easy-medium' | 'medium' | 'medium-hard' | 'hard' | 'very-hard'

export const DIFFICULTY_LABELS_HE: Record<Difficulty, string> = {
  easy: 'קל',
  'easy-medium': 'קל–בינוני',
  medium: 'בינוני',
  'medium-hard': 'בינוני–קשה',
  hard: 'קשה',
  'very-hard': 'קשה מאוד',
}

/** Category tags used for both grouping and library filtering. */
export type ExerciseCategory =
  | 'warmup' // חימום
  | 'mobility' // מוביליטי
  | 'strength' // חיזוק
  | 'kick-technique' // טכניקת בעיטה
  | 'stretch' // מתיחות
  | 'pelvis' // אגן
  | 'hamstring' // המסטרינג
  | 'adductors' // אדוקטורים
  | 'hip-flexors' // מרימי ירך
  | 'balance' // שיווי משקל
  | 'pivot-leg' // רגל ציר

export const CATEGORY_LABELS_HE: Record<ExerciseCategory, string> = {
  warmup: 'חימום',
  mobility: 'מוביליטי',
  strength: 'חיזוק',
  'kick-technique': 'טכניקת בעיטה',
  stretch: 'מתיחות',
  pelvis: 'אגן',
  hamstring: 'המסטרינג',
  adductors: 'אדוקטורים',
  'hip-flexors': 'מרימי ירך',
  balance: 'שיווי משקל',
  'pivot-leg': 'רגל ציר',
}

/** How an exercise's duration is driven during the active workout. */
export type DurationType = 'time' | 'reps' | 'time-per-side' | 'reps-per-side'

export interface WeekProgressionNote {
  weeks: number[]
  note: string
}

export interface Exercise {
  id: string
  nameHe: string
  nameEn: string
  categories: ExerciseCategory[]
  description: string
  durationType: DurationType
  /** Seconds, when durationType is time / time-per-side */
  durationSeconds?: number
  /** Rep count, when durationType is reps / reps-per-side */
  reps?: number
  /** Optional hold time within a rep (e.g. chamber hold) */
  holdSeconds?: number
  difficulty: Difficulty
  cues: string[]
  commonMistakes: string[]
  equipment: string[]
  image?: string
  video?: string
  beginnerAdaptation?: string
  advancedAdaptation?: string
  weekProgression?: WeekProgressionNote[]
  safetyWarnings?: string[]
}

export interface WorkoutSectionExerciseRef {
  exerciseId: string
  /** Per-instance override, e.g. this workout uses 30s instead of the library default */
  durationSecondsOverride?: number
  repsOverride?: number
  intensityNote?: string
}

export interface WorkoutSection {
  id: string
  titleHe: string
  exercises: WorkoutSectionExerciseRef[]
}

export interface Workout {
  id: WorkoutId
  nameHe: string
  totalDurationMinutes: number
  equipment: string[]
  warningHe: string
  sections: WorkoutSection[]
}

export type PainLocation =
  | 'groin'
  | 'front-thigh'
  | 'back-thigh'
  | 'side-thigh'
  | 'knee'
  | 'lower-back'
  | 'ankle'
  | 'other'

export const PAIN_LOCATION_LABELS_HE: Record<PainLocation, string> = {
  groin: 'מפשעה',
  'front-thigh': 'ירך קדמית',
  'back-thigh': 'ירך אחורית',
  'side-thigh': 'צד הירך',
  knee: 'ברך',
  'lower-back': 'גב תחתון',
  ankle: 'קרסול',
  other: 'אחר',
}

export type PainSensation = 'stretch' | 'muscular-load' | 'dull-ache' | 'sharp-pain' | 'joint-pinch' | 'instability'

export const PAIN_SENSATION_LABELS_HE: Record<PainSensation, string> = {
  stretch: 'מתיחה',
  'muscular-load': 'עומס שרירי',
  'dull-ache': 'כאב עמום',
  'sharp-pain': 'כאב חד',
  'joint-pinch': 'צביטה במפרק',
  instability: 'חוסר יציבות',
}

export interface PainReport {
  id: string
  timestamp: string
  exerciseId?: string
  location: PainLocation
  sensation: PainSensation
  intensity: number // 0-10
}

export type ExerciseResultStatus = 'completed' | 'skipped' | 'partial'

export interface ExerciseResult {
  exerciseId: string
  order: number
  status: ExerciseResultStatus
  side?: SideOrBoth
  repsCompleted?: number
  durationSecondsActual?: number
  painReports?: PainReport[]
}

export type SessionStatus = 'in-progress' | 'completed' | 'partial' | 'skipped'

export interface WorkoutSession {
  id: string
  workoutId: WorkoutId
  week: number // 1-8
  slot: WeekSlot
  date: string // ISO date
  startedAt: string
  completedAt?: string
  actualDurationSeconds: number
  status: SessionStatus
  exerciseResults: ExerciseResult[]
  skippedExerciseIds: string[]
  effortRating?: number // 1-10
  painRating?: number // 0-10
  stabilityRating?: number // 1-5
  controlRating?: number // 1-5
  feltImprovement?: boolean | null
  notes?: string
  sideQuestions?: {
    betterSide?: SideOrBoth
    excessiveBackLean?: boolean
    pivotLegRotatedFreely?: boolean
    sharpPain?: boolean
    changeNextTime?: string
  }
  mediaIds: string[]
  // TODO(future): syncStatus / remoteId for Supabase multi-device sync
}

export type HeightMethodLandmark = 'belt' | 'ribs' | 'chest' | 'shoulder' | 'neck' | 'head' | 'above-head'

export const HEIGHT_LANDMARK_LABELS_HE: Record<HeightMethodLandmark, string> = {
  belt: 'חגורה',
  ribs: 'צלעות',
  chest: 'חזה',
  shoulder: 'כתף',
  neck: 'צוואר',
  head: 'ראש',
  'above-head': 'מעל הראש',
}

/** Kick height captured via either the landmark method or centimeters; both are kept when available. */
export interface KickHeightValue {
  landmark?: HeightMethodLandmark
  cm?: number
}

export interface WeeklyAssessment {
  id: string
  week: number
  date: string
  kickHeightRight: KickHeightValue
  kickHeightLeft: KickHeightValue
  holdTimeRightSeconds: number
  holdTimeLeftSeconds: number
  pivotRating: number // 1-5
  stabilityRating: number // 1-5
  backLeanRating: number // 1-5 (lower = more excessive lean)
  mediaIds: string[]
  notes?: string
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  createdAt: string
  workoutSessionId?: string
  weeklyAssessmentId?: string
  side?: SideOrBoth
  label?: string
  sourceType: 'upload' | 'youtube' | 'vimeo'
  /** Key into the IndexedDB blob store, when sourceType === 'upload' */
  blobKey?: string
  thumbnailBlobKey?: string
  externalUrl?: string
  durationSeconds?: number
  sizeBytes?: number
}

export interface ProgressMetricPoint {
  date: string
  week: number
  value: number
}

export type TextSize = 'normal' | 'large' | 'xlarge'

export interface AppSettings {
  soundEnabled: boolean
  vibrationEnabled: boolean
  autoRestBetweenExercises: boolean
  restDurationSeconds: number
  startWithWeakSide: boolean
  weakSide: Side
  textSize: TextSize
  keepScreenOn: boolean
  darkMode: true // v1 is dark-only; field kept for future light-mode toggle
}

export interface UserProfile {
  id: string
  name?: string
  age?: number
  weakSide: Side
  strongSide: Side
  programStartDate: string // ISO date
  // TODO(future): email / auth uid once Supabase auth is wired in
}

export interface AppDataExport {
  appVersion: string
  exportedAt: string
  profile: UserProfile
  settings: AppSettings
  sessions: WorkoutSession[]
  weeklyAssessments: WeeklyAssessment[]
  mediaIndex: Omit<MediaItem, 'blobKey' | 'thumbnailBlobKey'>[]
}
