import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Screen, PageHeader } from '../components/layout/Screen'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { RatingScale } from '../components/ui/RatingScale'
import { NumberStepper } from '../components/ui/NumberStepper'
import { HeightInput } from '../components/assessment/HeightInput'
import { MediaUploader } from '../components/media/MediaUploader'
import { useToast } from '../components/ui/Toast'
import { saveWeeklyAssessment } from '../lib/db'
import { createId } from '../lib/id'
import type { KickHeightValue, MediaItem, WeeklyAssessment as WeeklyAssessmentType } from '../types'

export function WeeklyAssessment() {
  const { week: weekParam } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const week = Number(weekParam)

  const [kickHeightRight, setKickHeightRight] = useState<KickHeightValue>({})
  const [kickHeightLeft, setKickHeightLeft] = useState<KickHeightValue>({})
  const [holdRight, setHoldRight] = useState(0)
  const [holdLeft, setHoldLeft] = useState(0)
  const [pivotRating, setPivotRating] = useState<number>()
  const [stabilityRating, setStabilityRating] = useState<number>()
  const [backLeanRating, setBackLeanRating] = useState<number>()
  const [notes, setNotes] = useState('')
  const [mediaItems, setMediaItems] = useState<Partial<Record<'right' | 'left', MediaItem>>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const canSave = pivotRating !== undefined && stabilityRating !== undefined && backLeanRating !== undefined

  async function handleSave() {
    setSaving(true)
    const assessment: WeeklyAssessmentType = {
      id: createId(),
      week,
      date: new Date().toISOString().slice(0, 10),
      kickHeightRight,
      kickHeightLeft,
      holdTimeRightSeconds: holdRight,
      holdTimeLeftSeconds: holdLeft,
      pivotRating: pivotRating!,
      stabilityRating: stabilityRating!,
      backLeanRating: backLeanRating!,
      mediaIds: Object.values(mediaItems)
        .filter((m): m is MediaItem => !!m)
        .map((m) => m.id),
      notes: notes || undefined,
    }
    await saveWeeklyAssessment(assessment)
    setSaving(false)
    setSaved(true)
    showToast('הבדיקה השבועית נשמרה', 'success')
  }

  if (saved) {
    return (
      <Screen>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <CheckCircle2 size={48} className="text-ok" aria-hidden />
          <h1 className="text-xl font-bold">הבדיקה השבועית נשמרה!</h1>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => navigate('/progress')}>
              לצפייה בהתקדמות
            </Button>
            <Button onClick={() => navigate('/')}>למסך הבית</Button>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <PageHeader titleHe="בדיקה שבועית" subtitleHe={`שבוע ${week} · לבצע לאחר חימום`} />

      <div className="px-5 space-y-4">
        <Card>
          <h2 className="font-semibold mb-3 text-sm">גובה בעיטה נקי</h2>
          <HeightInput labelHe="צד ימין" value={kickHeightRight} onChange={setKickHeightRight} />
          <HeightInput labelHe="צד שמאל" value={kickHeightLeft} onChange={setKickHeightLeft} />
        </Card>

        <Card>
          <h2 className="font-semibold mb-3 text-sm">זמן החזקה בגובה</h2>
          <NumberStepper labelHe="צד ימין" value={holdRight} onChange={setHoldRight} suffixHe="שנ'" />
          <NumberStepper labelHe="צד שמאל" value={holdLeft} onChange={setHoldLeft} suffixHe="שנ'" />
        </Card>

        <Card>
          <RatingScale min={1} max={5} value={pivotRating} onChange={setPivotRating} labelHe="דירוג סיבוב רגל הציר" lowLabelHe="נתקעת" highLabelHe="חופשי" />
          <RatingScale min={1} max={5} value={stabilityRating} onChange={setStabilityRating} labelHe="דירוג יציבות" lowLabelHe="נופל" highLabelHe="יציב" />
          <RatingScale min={1} max={5} value={backLeanRating} onChange={setBackLeanRating} labelHe="דירוג הטיית הגב" lowLabelHe="הטיה חזקה" highLabelHe="ללא הטיה" />
        </Card>

        <Card>
          <p className="text-sm font-medium mb-2">צילום שלוש בעיטות מכל צד</p>
          <div className="space-y-2">
            <MediaUploader
              labelHe="סרטון — צד ימין"
              kind="video"
              side="right"
              uploaded={mediaItems.right}
              onUploaded={(m) => setMediaItems((p) => ({ ...p, right: m }))}
              onRemove={() => setMediaItems((p) => ({ ...p, right: undefined }))}
            />
            <MediaUploader
              labelHe="סרטון — צד שמאל"
              kind="video"
              side="left"
              uploaded={mediaItems.left}
              onUploaded={(m) => setMediaItems((p) => ({ ...p, left: m }))}
              onRemove={() => setMediaItems((p) => ({ ...p, left: undefined }))}
            />
          </div>
        </Card>

        <Card>
          <label className="block text-sm font-medium mb-1.5" htmlFor="assessment-notes">
            הערות
          </label>
          <textarea
            id="assessment-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-surface-2 p-3 text-sm"
          />
        </Card>

        <Button size="xl" fullWidth disabled={!canSave || saving} onClick={handleSave}>
          {saving ? 'שומר...' : 'שמור בדיקה שבועית'}
        </Button>
      </div>
    </Screen>
  )
}
