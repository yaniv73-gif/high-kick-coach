import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, CalendarCheck, TrendingUp, Clock, ClipboardList, PartyPopper } from 'lucide-react'
import { Screen } from '../components/layout/Screen'
import { LoadingState } from '../components/layout/LoadingState'
import { Card, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useAppState } from '../store/AppStateContext'
import { useSessions } from '../hooks/useSessions'
import { useWeeklyAssessments } from '../hooks/useWeeklyAssessments'
import { getNextWorkout, getWeekCompletedCount, getCurrentStreak, getLastWorkoutDate, getOverallCompletionPercent } from '../lib/plan'
import { TOTAL_WEEKS } from '../lib/progression'
import { getQuoteForDay } from '../data/weeklyGoals'
import { formatDateHe, formatKickHeight } from '../lib/format'

export function Home() {
  const navigate = useNavigate()
  const { currentWeek, profile } = useAppState()
  const { sessions, isLoading } = useSessions()
  const { assessments } = useWeeklyAssessments()

  const nextWorkout = useMemo(() => getNextWorkout(sessions, currentWeek), [sessions, currentWeek])
  const completedThisWeek = useMemo(() => getWeekCompletedCount(sessions, currentWeek), [sessions, currentWeek])
  const streak = useMemo(() => getCurrentStreak(sessions), [sessions])
  const lastWorkoutDate = useMemo(() => getLastWorkoutDate(sessions), [sessions])
  const completionPercent = useMemo(() => getOverallCompletionPercent(sessions), [sessions])
  const quote = useMemo(() => getQuoteForDay(), [])

  const latestAssessment = assessments.length > 0 ? assessments[assessments.length - 1] : undefined
  const hasAssessmentThisWeek = assessments.some((a) => a.week === currentWeek)

  if (isLoading) return <LoadingState labelHe="טוען את התכנית..." />

  return (
    <Screen>
      <header className="px-5 pt-6 pb-2">
        <p className="text-brand font-semibold text-sm">שבוע {currentWeek} מתוך {TOTAL_WEEKS}</p>
        <h1 className="text-2xl font-bold mt-0.5">High Kick Coach</h1>
        <p className="text-text-muted text-sm mt-2 italic">"{quote}"</p>
      </header>

      <div className="px-5 space-y-4 mt-2">
        {nextWorkout.isProgramComplete ? (
          <Card className="text-center py-8 border-brand/50">
            <PartyPopper size={32} className="mx-auto mb-2 text-brand" aria-hidden />
            <h2 className="text-lg font-bold">סיימת את התכנית המלאה!</h2>
            <p className="text-text-muted text-sm mt-1">כל הכבוד על שמונה שבועות של עבודה עקבית.</p>
            <Button className="mt-4" onClick={() => navigate('/progress')}>
              לצפייה בהתקדמות
            </Button>
          </Card>
        ) : (
          <Card>
            <p className="text-text-muted text-sm mb-1">האימון הבא</p>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">אימון {nextWorkout.workoutId}</h2>
              <span className="flex items-center gap-1.5 text-text-muted text-sm">
                <Clock size={16} aria-hidden />
                כ־24 דק'
              </span>
            </div>
            <Button
              size="xl"
              fullWidth
              onClick={() => navigate(`/workout/${nextWorkout.workoutId}/${nextWorkout.week}/${nextWorkout.slot}`)}
            >
              התחל אימון
            </Button>
          </Card>
        )}

        <Card>
          <CardTitle>התקדמות כוללת</CardTitle>
          <ProgressBar value={completionPercent} />
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <CalendarCheck size={16} aria-hidden />
              השבוע
            </div>
            <p className="text-2xl font-bold">{completedThisWeek}/4</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <Flame size={16} aria-hidden />
              רצף אימונים
            </div>
            <p className="text-2xl font-bold">{streak}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <TrendingUp size={16} aria-hidden />
              אימון אחרון
            </div>
            <p className="text-lg font-bold">{formatDateHe(lastWorkoutDate)}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <ClipboardList size={16} aria-hidden />
              בדיקה שבועית
            </div>
            {hasAssessmentThisWeek ? (
              <p className="text-sm font-semibold text-ok">בוצעה השבוע</p>
            ) : (
              <button
                className="text-sm font-semibold text-brand underline underline-offset-2"
                onClick={() => navigate(`/assessment/${currentWeek}`)}
              >
                לביצוע עכשיו
              </button>
            )}
          </Card>
        </div>

        <Card>
          <CardTitle>צד חזק / צד חלש</CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-1">
                צד חזק ({profile.strongSide === 'right' ? 'ימין' : 'שמאל'})
              </p>
              <p className="text-text-muted text-xs">
                גובה: {formatKickHeight(profile.strongSide === 'right' ? latestAssessment?.kickHeightRight : latestAssessment?.kickHeightLeft)}
              </p>
              <p className="text-text-muted text-xs">
                החזקה: {profile.strongSide === 'right' ? latestAssessment?.holdTimeRightSeconds ?? '—' : latestAssessment?.holdTimeLeftSeconds ?? '—'} שנ'
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">
                צד חלש ({profile.weakSide === 'right' ? 'ימין' : 'שמאל'})
              </p>
              <p className="text-text-muted text-xs">
                גובה: {formatKickHeight(profile.weakSide === 'right' ? latestAssessment?.kickHeightRight : latestAssessment?.kickHeightLeft)}
              </p>
              <p className="text-text-muted text-xs">
                החזקה: {profile.weakSide === 'right' ? latestAssessment?.holdTimeRightSeconds ?? '—' : latestAssessment?.holdTimeLeftSeconds ?? '—'} שנ'
              </p>
            </div>
          </div>
          {!latestAssessment && <p className="text-text-muted text-xs mt-3">בצע בדיקה שבועית כדי לראות נתונים כאן.</p>}
        </Card>
      </div>
    </Screen>
  )
}
