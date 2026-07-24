import { AlertTriangle, ShieldAlert } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { ExercisePlaceholder } from './ExercisePlaceholder'
import { CATEGORY_LABELS_HE, DIFFICULTY_LABELS_HE, type Exercise } from '../../types'

export function ExerciseDetailModal({ exercise, onOpenChange }: { exercise: Exercise | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={!!exercise} onOpenChange={onOpenChange} titleHe={exercise?.nameHe ?? ''}>
      {exercise && (
        <div className="space-y-4">
          <ExercisePlaceholder categories={exercise.categories} imageUrl={exercise.image} className="w-full h-32" />
          {exercise.video && (
            <a href={exercise.video} target="_blank" rel="noreferrer" className="block text-brand text-sm underline">
              צפה בסרטון הדגמה
            </a>
          )}
          <p className="text-text-muted text-xs">{exercise.nameEn}</p>
          <p className="text-sm">{exercise.description}</p>

          <div className="flex flex-wrap gap-2">
            {exercise.categories.map((c) => (
              <span key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">
                {CATEGORY_LABELS_HE[c]}
              </span>
            ))}
            <span className="rounded-full bg-brand/15 text-brand px-2.5 py-1 text-xs font-medium">
              {DIFFICULTY_LABELS_HE[exercise.difficulty]}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1.5">דגשים טכניים</h4>
            <ul className="text-sm space-y-1">
              {exercise.cues.map((cue) => (
                <li key={cue} className="flex gap-2">
                  <span className="text-brand">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-warn" aria-hidden />
              טעויות נפוצות
            </h4>
            <ul className="text-sm space-y-1 text-text-muted">
              {exercise.commonMistakes.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>

          {exercise.equipment.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1">ציוד</h4>
              <p className="text-sm text-text-muted">{exercise.equipment.join(', ')}</p>
            </div>
          )}

          {(exercise.beginnerAdaptation || exercise.advancedAdaptation) && (
            <div className="grid grid-cols-1 gap-2">
              {exercise.beginnerAdaptation && (
                <div className="rounded-lg bg-surface-2 p-2.5 text-sm">
                  <span className="font-medium">התאמה למתחילים: </span>
                  {exercise.beginnerAdaptation}
                </div>
              )}
              {exercise.advancedAdaptation && (
                <div className="rounded-lg bg-surface-2 p-2.5 text-sm">
                  <span className="font-medium">התאמה למתקדמים: </span>
                  {exercise.advancedAdaptation}
                </div>
              )}
            </div>
          )}

          {exercise.safetyWarnings && exercise.safetyWarnings.length > 0 && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" aria-hidden />
              <div>
                {exercise.safetyWarnings.map((w) => (
                  <p key={w}>{w}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  )
}
