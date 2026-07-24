import { useRef, useState } from 'react'
import { Download, Upload, RotateCcw, FileJson, FileSpreadsheet } from 'lucide-react'
import { Screen, PageHeader } from '../components/layout/Screen'
import { Card, CardTitle } from '../components/ui/Card'
import { Switch } from '../components/ui/Switch'
import { Button } from '../components/ui/Button'
import { NumberStepper } from '../components/ui/NumberStepper'
import { useToast } from '../components/ui/Toast'
import { useAppState } from '../store/AppStateContext'
import { exportAsCsv, exportAsJson, importFromJsonFile } from '../lib/export'
import { clearAllIndexedData } from '../lib/db'
import { resetLocalState } from '../lib/storage'
import { cn } from '../lib/cn'
import type { Side, TextSize } from '../types'

const TEXT_SIZE_OPTIONS: { value: TextSize; labelHe: string }[] = [
  { value: 'normal', labelHe: 'רגיל' },
  { value: 'large', labelHe: 'גדול' },
  { value: 'xlarge', labelHe: 'גדול מאוד' },
]

export function Settings() {
  const { settings, updateSettings } = useAppState()
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleImport(file: File) {
    setBusy(true)
    const result = await importFromJsonFile(file)
    setBusy(false)
    showToast(result.message, result.success ? 'success' : 'error')
  }

  async function handleReset() {
    if (!confirmingReset) {
      setConfirmingReset(true)
      return
    }
    setBusy(true)
    await clearAllIndexedData()
    resetLocalState()
    setBusy(false)
    showToast('התכנית אופסה. האפליקציה תיטען מחדש.', 'success')
    setTimeout(() => window.location.reload(), 1200)
  }

  return (
    <Screen>
      <PageHeader titleHe="הגדרות" />

      <div className="px-5 space-y-4">
        <Card>
          <CardTitle>אימון</CardTitle>
          <Switch
            id="sound"
            labelHe="צלילים"
            checked={settings.soundEnabled}
            onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
          />
          <Switch
            id="vibration"
            labelHe="רטט"
            checked={settings.vibrationEnabled}
            onCheckedChange={(v) => updateSettings({ vibrationEnabled: v })}
          />
          <Switch
            id="auto-rest"
            labelHe="מנוחה אוטומטית בין תרגילים"
            checked={settings.autoRestBetweenExercises}
            onCheckedChange={(v) => updateSettings({ autoRestBetweenExercises: v })}
          />
          {settings.autoRestBetweenExercises && (
            <NumberStepper
              labelHe="משך מנוחה"
              value={settings.restDurationSeconds}
              onChange={(v) => updateSettings({ restDurationSeconds: v })}
              step={5}
              min={0}
              suffixHe="שנ'"
            />
          )}
          <Switch
            id="weak-side-first"
            labelHe="התחלה בצד החלש"
            checked={settings.startWithWeakSide}
            onCheckedChange={(v) => updateSettings({ startWithWeakSide: v })}
          />
          <div className="py-2">
            <p className="text-base mb-2">הצד החלש</p>
            <div className="flex gap-2">
              {(['right', 'left'] as Side[]).map((side) => (
                <button
                  key={side}
                  onClick={() => updateSettings({ weakSide: side })}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-2.5 text-sm font-medium',
                    settings.weakSide === side ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
                  )}
                >
                  {side === 'right' ? 'ימין' : 'שמאל'}
                </button>
              ))}
            </div>
          </div>
          <Switch
            id="keep-screen-on"
            labelHe="שמירת מסך פעיל בזמן אימון"
            checked={settings.keepScreenOn}
            onCheckedChange={(v) => updateSettings({ keepScreenOn: v })}
          />
        </Card>

        <Card>
          <CardTitle>תצוגה</CardTitle>
          <p className="text-base mb-2">גודל טקסט</p>
          <div className="flex gap-2">
            {TEXT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ textSize: opt.value })}
                className={cn(
                  'flex-1 rounded-xl border-2 py-2.5 text-sm font-medium',
                  settings.textSize === opt.value ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2',
                )}
              >
                {opt.labelHe}
              </button>
            ))}
          </div>
          <p className="text-text-muted text-xs mt-3">האפליקציה פועלת במצב כהה בלבד בגרסה הנוכחית.</p>
        </Card>

        <Card>
          <CardTitle>נתונים</CardTitle>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Button variant="outline" size="md" disabled={busy} onClick={() => exportAsJson()}>
              <FileJson size={18} />
              ייצוא JSON
            </Button>
            <Button variant="outline" size="md" disabled={busy} onClick={() => exportAsCsv()}>
              <FileSpreadsheet size={18} />
              ייצוא CSV
            </Button>
          </div>
          <Button
            variant="outline"
            size="md"
            fullWidth
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            ייבוא נתונים מקובץ JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImport(file)
              e.target.value = ''
            }}
          />
          <p className="text-text-muted text-xs mt-2 flex items-center gap-1.5">
            <Download size={14} aria-hidden />
            הגיבוי כולל אימונים, בדיקות שבועיות והגדרות (ללא קבצי מדיה).
          </p>
        </Card>

        <Card className="border-danger/40">
          <CardTitle>אזור מסוכן</CardTitle>
          <Button variant="danger" size="md" fullWidth disabled={busy} onClick={handleReset}>
            <RotateCcw size={18} />
            {confirmingReset ? 'לחץ שוב לאישור איפוס' : 'איפוס התכנית'}
          </Button>
          {confirmingReset && (
            <p className="text-danger text-xs mt-2">פעולה זו תמחק את כל האימונים, הבדיקות והמדיה השמורים. לא ניתן לבטל.</p>
          )}
        </Card>
      </div>
    </Screen>
  )
}
