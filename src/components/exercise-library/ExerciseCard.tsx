import type { Exercise } from '../../types'
import { CATEGORY_LABELS_HE, DIFFICULTY_LABELS_HE } from '../../types'
import { ExercisePlaceholder } from './ExercisePlaceholder'

export function ExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full rounded-xl border border-border bg-surface p-3 text-start hover:border-brand/50 transition-colors"
    >
      <ExercisePlaceholder categories={exercise.categories} imageUrl={exercise.image} className="w-16 h-14 shrink-0" />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm truncate">{exercise.nameHe}</h3>
        <p className="text-text-muted text-xs truncate">{exercise.categories.map((c) => CATEGORY_LABELS_HE[c]).join(' · ')}</p>
        <span className="inline-block mt-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-muted">
          {DIFFICULTY_LABELS_HE[exercise.difficulty]}
        </span>
      </div>
    </button>
  )
}
