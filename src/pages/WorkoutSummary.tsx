import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, SkipForward, Clock } from 'lucide-react'
import { Screen, PageHeader } from '../components/layout/Screen'
import { LoadingState } from '../components/layout/LoadingState'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { RatingScale } from '../components/ui/RatingScale'
import { MediaUploader } from '../components/media/MediaUploader'
import { useToast } from '../components/ui/Toast'
import { getSession, saveSession } from '../lib/db'
import { formatMinutes } from '../lib/format'
import { cn } from '../lib/cn'
import type { MediaItem, SideOrBoth, WorkoutSession } from '../types'

export function WorkoutSummary() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [effort, setEffort] = useState<number>()
  const [pain, setPain] = useState<number>()
  const [stability, setStability] = useState<number>()
  const [control, setControl] = useState<number>()
  const [improvement, setImprovement] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [betterSide, setBetterSide] = useState<SideOrBoth>()
  const [excessiveBackLean, setExcessiveBackLean] = useState<boolean | null>(null)
  const [pivotFree, setPivotFree] = useState<boolean | null>(null)
  const [sharpPain, setSharpPain] = useState<boolean | null>(null)
  const [changeNextTime, setChangeNextTime] = useState('')
  const [mediaItems, setMediaItems] = useState<Partial<Record<'photo' | 'right' | 'left', MediaItem>>>({})

  useEffect(() => {
    if (!sessionId) return
    getSession(sessionId).then((s) => {
      setSession(s ?? null)
      setIsLoading(false)
    })
  }, [sessionId])

  if (isLoading) return <LoadingState labelHe="טוען סיכום..." />
  if (!session) {
    return (
      <Screen>
        <PageHeader titleHe="סיכום אימון" />
        <p className="px-5 text-text-muted">האימון לא נמצא.</p>
      </Screen>
    )
  }

  const completedCount = session.exerciseResults.filter((r) => r.status === 'completed').length
  const skippedCount = session.exerciseResults.filter((r) => r.status === 'skipped').length

  async function handleSave() {
    if (!session) return
    setSaving(true)
    const mediaIds = Object.values(mediaItems)
      .filter((m): m is MediaItem => !!m)
      .map((m) => m.id)

    const updated: WorkoutSession = {
      ...session,
      effortRating: effort,
      painRating: pain,
      stabilityRating: stability,
      controlRating: control,
      feltImprovement: improvement,
      notes,
      sideQuestions: {
        betterSide,
        excessiveBackLean: excessiveBackLean ?? undefined,
        pivotLegRotatedFreely: pivotFree ?? undefined,
        sharpPain: sharpPain ?? undefined,
        changeNextTime: changeNextTime || undefined,
      },
      mediaIds,
    }
    await saveSession(updated)
    setSaving(false)
    setSaved(true)
    showToast('הסיכום נשמר', 'success')
  }

  if (saved) {
    return (
      <Screen>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <CheckCircle2 size={48} className="text-ok" aria-hidden />
          <h1 className="text-xl font-bold">האימון נשמר!</h1>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => navigate('/plan')}>
              לתכנית
            </Button>
            <Button onClick={() => navigate('/')}>למסך הבית</Button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <PageHeader titleHe="סיכום אימון" subtitleHe={`אימון ${session.workoutId} · שבוע ${session.week}`} />

      <div className="px-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <Clock size={18} className="mx-auto mb-1 text-text-muted" aria-hidden />
            <p className="text-lg font-bold">{formatMinutes(session.actualDurationSeconds)}</p>
            <p className="text-xs text-text-muted">זמן כולל</p>
          </Card>
          <Card className="text-center">
            <CheckCircle2 size={18} className="mx-auto mb-1 text-ok" aria-hidden />
            <p className="text-lg font-bold">{completedCount}</p>
            <p className="text-xs text-text-muted">הושלמו</p>
          </Card>
          <Card className="text-center">
            <SkipForward size={18} className="mx-auto mb-1 text-warn" aria-hidden />
            <p className="text-lg font-bold">{skippedCount}</p>
            <p className="text-xs text-text-muted">דולגו</p>
          </Card>
        </div>

        <Card>
          <RatingScale min={1} max={10} value={effort} onChange={setEffort} labelHe="דירוג מאמץ" lowLabelHe="קל" highLabelHe="מקסימלי" />
          <RatingScale min={0} max={10} value={pain} onChange={setPain} labelHe="דירוג כאב / אי-נוחות" lowLabelHe="ללא" highLabelHe="חמור" />
          <RatingScale min={1} max={5} value={stability} onChange={setStability} labelHe="דירוג יציבות" />
          <RatingScale min={1} max={5} value={control} onChange={setControl} labelHe="דירוג שליטה בטווח" />
        </Card>

        <Card>
          <CardQuestion label="האם הורגש שיפור לעומת האימון הקודם?">
            <YesNo value={improvement} onChange={setImprovement} />
          </CardQuestion>
          <CardQuestion label="איזה צד הרגיש טוב יותר?">
            <div className="flex gap-2">
              {(['right', 'left', 'both'] as SideOrBoth[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setBetterSide(s)}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-2 text-sm font-medium',
                    betterSide === s ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
                  )}
                >
                  {s === 'right' ? 'ימין' : s === 'left' ? 'שמאל' : 'שניהם'}
                </button>
              ))}
            </div>
          </CardQuestion>
          <CardQuestion label="האם הייתה הטיית גב מוגזמת?">
            <YesNo value={excessiveBackLean} onChange={setExcessiveBackLean} />
          </CardQuestion>
          <CardQuestion label="האם רגל הציר הסתובבה בחופשיות?">
            <YesNo value={pivotFree} onChange={setPivotFree} />
          </CardQuestion>
          <CardQuestion label="האם היה כאב חד?">
            <YesNo value={sharpPain} onChange={setSharpPain} />
          </CardQuestion>
        </Card>

        <Card>
          <label className="block text-sm font-medium mb-1.5" htmlFor="change-next-time">
            האם לשנות משהו באימון הבא?
          </label>
          <textarea
            id="change-next-time"
            value={changeNextTime}
            onChange={(e) => setChangeNextTime(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-surface-2 p-3 text-sm mb-4"
          />
          <label className="block text-sm font-medium mb-1.5" htmlFor="notes">
            הערות נוספות
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface-2 p-3 text-sm"
          />
        </Card>

        <Card>
          <p className="text-sm font-medium mb-2">תיעוד מדיה (אופציונלי)</p>
          <div className="space-y-2">
            <MediaUploader
              labelHe="צילום תמונה"
              kind="image"
              uploaded={mediaItems.photo}
              onUploaded={(m) => setMediaItems((p) => ({ ...p, photo: m }))}
              onRemove={() => setMediaItems((p) => ({ ...p, photo: undefined }))}
            />
            <MediaUploader
              labelHe="סרטון בעיטה — צד ימין"
              kind="video"
              side="right"
              uploaded={mediaItems.right}
              onUploaded={(m) => setMediaItems((p) => ({ ...p, right: m }))}
              onRemove={() => setMediaItems((p) => ({ ...p, right: undefined }))}
            />
            <MediaUploader
              labelHe="סרטון בעיטה — צד שמאל"
              kind="video"
              side="left"
              uploaded={mediaItems.left}
              onUploaded={(m) => setMediaItems((p) => ({ ...p, left: m }))}
              onRemove={() => setMediaItems((p) => ({ ...p, left: undefined }))}
            />
          </div>
        </Card>

        <Button size="xl" fullWidth disabled={saving} onClick={handleSave}>
          {saving ? 'שומר...' : 'שמור סיכום'}
        </Button>
      </div>
    </Screen>
  )
}

function CardQuestion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm font-medium mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(true)}
        className={cn(
          'flex-1 rounded-xl border-2 py-2 text-sm font-medium',
          value === true ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
        )}
      >
        כן
      </button>
      <button
        onClick={() => onChange(false)}
        className={cn(
          'flex-1 rounded-xl border-2 py-2 text-sm font-medium',
          value === false ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
        )}
      >
        לא
      </button>
    </div>
  )
}
