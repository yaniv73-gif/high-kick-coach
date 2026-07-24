import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Screen, PageHeader } from '../components/layout/Screen'
import { LoadingState } from '../components/layout/LoadingState'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useSessions } from '../hooks/useSessions'
import { useAppState } from '../store/AppStateContext'
import { getNextWorkout, getSlotStatus, getWorkoutIdForSlot } from '../lib/plan'
import { TOTAL_WEEKS } from '../lib/progression'
import { getWeekGoal } from '../data/weeklyGoals'
import { cn } from '../lib/cn'
import type { WeekSlot } from '../types'

const SLOTS: WeekSlot[] = [1, 2, 3, 4]

export function Plan() {
  const navigate = useNavigate()
  const { currentWeek } = useAppState()
  const { sessions, isLoading } = useSessions()
  const nextWorkout = useMemo(() => getNextWorkout(sessions, currentWeek), [sessions, currentWeek])

  if (isLoading) return <LoadingState labelHe="טוען תכנית..." />

  return (
    <Screen>
      <PageHeader titleHe="התכנית שלי" subtitleHe="8 שבועות · 4 אימונים בשבוע" />
      <div className="px-5 space-y-4">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((week) => {
          const goal = getWeekGoal(week)
          const isCurrentWeek = week === currentWeek
          return (
            <Card key={week} className={cn(isCurrentWeek && 'border-brand')}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-lg">שבוע {week}</h2>
                {isCurrentWeek && (
                  <span className="text-xs font-semibold text-brand bg-brand/15 px-2 py-1 rounded-full">
                    השבוע הנוכחי
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-text-muted mb-1">{goal.titleHe}</p>
              <ul className="text-xs text-text-muted mb-3 space-y-0.5">
                {goal.pointsHe.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <div className="grid grid-cols-4 gap-2">
                {SLOTS.map((slot) => {
                  const workoutId = getWorkoutIdForSlot(slot)
                  const status = getSlotStatus(sessions, week, slot)
                  const isSuggested = !nextWorkout.isProgramComplete && nextWorkout.week === week && nextWorkout.slot === slot
                  return (
                    <button
                      key={slot}
                      onClick={() => navigate(`/workout/${workoutId}/${week}/${slot}`)}
                      className={cn(
                        'relative flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition-colors',
                        isSuggested ? 'border-brand bg-brand/10' : 'border-border bg-surface-2 hover:border-brand/50',
                      )}
                    >
                      {isSuggested && <Star size={12} className="absolute top-1 left-1 text-brand" fill="currentColor" aria-hidden />}
                      <span className="text-lg font-bold">{workoutId}</span>
                      <StatusBadge status={status} className="text-[10px]" />
                    </button>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}
