import { AlertTriangle, Clock, Dumbbell } from 'lucide-react'
import type { Workout } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface WorkoutIntroProps {
  workout: Workout
  week: number
  onStart: () => void
}

export function WorkoutIntro({ workout, week, onStart }: WorkoutIntroProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between px-5 pt-8 pb-6 safe-top">
      <div>
        <p className="text-brand font-semibold text-sm mb-1">שבוע {week} מתוך 8</p>
        <h1 className="text-3xl font-bold mb-6">{workout.nameHe}</h1>

        <Card className="mb-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Clock size={18} className="text-text-muted" aria-hidden />
            <span>משך משוער: כ־{workout.totalDurationMinutes} דקות</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Dumbbell size={18} className="text-text-muted mt-0.5" aria-hidden />
            <span>ציוד: {workout.equipment.length > 0 ? workout.equipment.join(', ') : 'ללא ציוד מיוחד'}</span>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-2 text-sm">מבנה האימון</h2>
          <ul className="text-sm text-text-muted space-y-1">
            {workout.sections.map((section) => (
              <li key={section.id}>• {section.titleHe}</li>
            ))}
          </ul>
        </Card>

        <div className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger mt-4">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden />
          <p>{workout.warningHe}</p>
        </div>
      </div>

      <Button size="xl" fullWidth onClick={onStart} className="mt-6">
        התחל אימון
      </Button>
    </div>
  )
}
