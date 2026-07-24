import { useMemo, useState } from 'react'
import { Search, Dumbbell } from 'lucide-react'
import { Screen, PageHeader } from '../components/layout/Screen'
import { EmptyState } from '../components/layout/EmptyState'
import { ExerciseCard } from '../components/exercise-library/ExerciseCard'
import { ExerciseDetailModal } from '../components/exercise-library/ExerciseDetailModal'
import { getAllExercisesResolved } from '../data/exercises'
import { CATEGORY_LABELS_HE, type Exercise, type ExerciseCategory } from '../types'
import { cn } from '../lib/cn'

const CATEGORIES = Object.keys(CATEGORY_LABELS_HE) as ExerciseCategory[]

export function ExerciseLibrary() {
  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<ExerciseCategory[]>([])
  const [selected, setSelected] = useState<Exercise | null>(null)

  function toggleCategory(cat: ExerciseCategory) {
    setActiveCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]))
  }

  const allExercises = useMemo(() => getAllExercisesResolved(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allExercises.filter((ex) => {
      const matchesQuery = !q || ex.nameHe.includes(q) || ex.nameEn.toLowerCase().includes(q)
      const matchesCategory = activeCategories.length === 0 || activeCategories.some((c) => ex.categories.includes(c))
      return matchesQuery && matchesCategory
    })
  }, [query, activeCategories, allExercises])

  return (
    <Screen>
      <PageHeader titleHe="ספריית תרגילים" subtitleHe={`${allExercises.length} תרגילים`} />

      <div className="px-5 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש תרגיל..."
            aria-label="חיפוש תרגיל"
            className="w-full rounded-xl border border-border bg-surface-2 py-2.5 ps-10 pe-3 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                'rounded-full border-2 px-3 py-1.5 text-xs font-medium',
                activeCategories.includes(cat) ? 'border-brand bg-brand text-white' : 'border-border bg-surface-2 text-text-muted',
              )}
            >
              {CATEGORY_LABELS_HE[cat]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Dumbbell} titleHe="לא נמצאו תרגילים" descriptionHe="נסה חיפוש אחר או הסר סינון." />
        ) : (
          <div className="space-y-2 pb-4">
            {filtered.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} onClick={() => setSelected(exercise)} />
            ))}
          </div>
        )}
      </div>

      <ExerciseDetailModal exercise={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </Screen>
  )
}
