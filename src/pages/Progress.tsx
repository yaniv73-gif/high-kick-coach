import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Screen, PageHeader } from '../components/layout/Screen'
import { LoadingState } from '../components/layout/LoadingState'
import { Card, CardTitle } from '../components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { MediaTimeline } from '../components/progress/MediaTimeline'
import { useSessions } from '../hooks/useSessions'
import { useWeeklyAssessments } from '../hooks/useWeeklyAssessments'
import { buildWeeklySessionsData, buildRatingsTimeline, buildKickHeightTimeline, buildHoldTimeTimeline, getAssessmentForWeek } from '../lib/progressCharts'
import { formatKickHeight } from '../lib/format'
import { CHART_COLORS } from '../lib/chartColors'
import { TOTAL_WEEKS } from '../lib/progression'

const AXIS_PROPS = { stroke: CHART_COLORS.textMuted, fontSize: 11 }
const TOOLTIP_STYLE = { backgroundColor: '#1e1e1e', border: '1px solid #2b2b2b', borderRadius: 8, fontSize: 12 }

export function Progress() {
  const { sessions, isLoading: loadingSessions } = useSessions()
  const { assessments, isLoading: loadingAssessments } = useWeeklyAssessments()

  const weeklySessionsData = useMemo(() => buildWeeklySessionsData(sessions), [sessions])
  const ratingsData = useMemo(() => buildRatingsTimeline(sessions), [sessions])
  const kickHeightData = useMemo(() => buildKickHeightTimeline(assessments), [assessments])
  const holdTimeData = useMemo(() => buildHoldTimeTimeline(assessments), [assessments])

  const availableWeeks = useMemo(() => assessments.map((a) => a.week).sort((a, b) => a - b), [assessments])
  const [weekA, setWeekA] = useState<number>(1)
  const [weekB, setWeekB] = useState<number>(TOTAL_WEEKS)

  if (loadingSessions || loadingAssessments) return <LoadingState labelHe="טוען נתוני התקדמות..." />

  const assessmentA = getAssessmentForWeek(assessments, weekA)
  const assessmentB = getAssessmentForWeek(assessments, weekB)

  return (
    <Screen>
      <PageHeader titleHe="התקדמות" />

      <div className="px-5">
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">מגמות</TabsTrigger>
            <TabsTrigger value="compare">השוואת שבועות</TabsTrigger>
            <TabsTrigger value="media">מדיה</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardTitle>אימונים שהושלמו לפי שבוע</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklySessionsData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis dataKey="week" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} allowDecimals={false} domain={[0, 4]} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: CHART_COLORS.text }} />
                  <Bar dataKey="completed" name="אימונים" fill={CHART_COLORS.brand} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle>זמן אימון כולל לפי שבוע (דקות)</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklySessionsData}>
                  <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                  <XAxis dataKey="week" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: CHART_COLORS.text }} />
                  <Bar dataKey="minutes" name="דקות" fill={CHART_COLORS.ok} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle>דירוגים לאורך זמן</CardTitle>
              {ratingsData.length === 0 ? (
                <p className="text-text-muted text-sm">אין עדיין נתוני סיכום אימון.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={ratingsData}>
                    <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="index" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} domain={[0, 10]} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: CHART_COLORS.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="effort" name="מאמץ" stroke={CHART_COLORS.brand} strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="pain" name="כאב" stroke={CHART_COLORS.danger} strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="stability" name="יציבות" stroke={CHART_COLORS.ok} strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="control" name="שליטה" stroke={CHART_COLORS.warn} strokeWidth={2} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card>
              <CardTitle>גובה בעיטה לכל צד (בדיקות שבועיות)</CardTitle>
              {kickHeightData.length === 0 ? (
                <p className="text-text-muted text-sm">בצע בדיקה שבועית כדי לראות מגמה כאן.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={kickHeightData}>
                      <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                      <XAxis dataKey="week" {...AXIS_PROPS} />
                      <YAxis {...AXIS_PROPS} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: CHART_COLORS.text }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="right" name="ימין" stroke={CHART_COLORS.right} strokeWidth={2} connectNulls />
                      <Line type="monotone" dataKey="left" name="שמאל" stroke={CHART_COLORS.left} strokeWidth={2} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-text-muted text-[11px] mt-1">
                    הערך משלב מדידות בס"מ ולפי נקודת ציון בגוף בסולם משוער אחיד, לצורך מעקב מגמה בלבד.
                  </p>
                </>
              )}
            </Card>

            <Card>
              <CardTitle>משך החזקה בגובה לכל צד</CardTitle>
              {holdTimeData.length === 0 ? (
                <p className="text-text-muted text-sm">בצע בדיקה שבועית כדי לראות מגמה כאן.</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={holdTimeData}>
                    <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="week" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: CHART_COLORS.text }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="right" name="ימין" stroke={CHART_COLORS.right} strokeWidth={2} connectNulls />
                    <Line type="monotone" dataKey="left" name="שמאל" stroke={CHART_COLORS.left} strokeWidth={2} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            {availableWeeks.length < 1 ? (
              <p className="text-text-muted text-sm px-1">בצע לפחות בדיקה שבועית אחת כדי להשוות.</p>
            ) : (
              <Card>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <WeekSelect labelHe="שבוע להשוואה" value={weekA} onChange={setWeekA} weeks={availableWeeks} />
                  <WeekSelect labelHe="מול שבוע" value={weekB} onChange={setWeekB} weeks={availableWeeks} />
                </div>
                <ComparisonRow label="גובה — ימין" a={formatKickHeight(assessmentA?.kickHeightRight)} b={formatKickHeight(assessmentB?.kickHeightRight)} />
                <ComparisonRow label="גובה — שמאל" a={formatKickHeight(assessmentA?.kickHeightLeft)} b={formatKickHeight(assessmentB?.kickHeightLeft)} />
                <ComparisonRow label="החזקה — ימין" a={assessmentA ? `${assessmentA.holdTimeRightSeconds} שנ'` : '—'} b={assessmentB ? `${assessmentB.holdTimeRightSeconds} שנ'` : '—'} />
                <ComparisonRow label="החזקה — שמאל" a={assessmentA ? `${assessmentA.holdTimeLeftSeconds} שנ'` : '—'} b={assessmentB ? `${assessmentB.holdTimeLeftSeconds} שנ'` : '—'} />
                <ComparisonRow label="סיבוב רגל ציר" a={assessmentA ? `${assessmentA.pivotRating}/5` : '—'} b={assessmentB ? `${assessmentB.pivotRating}/5` : '—'} />
                <ComparisonRow label="יציבות" a={assessmentA ? `${assessmentA.stabilityRating}/5` : '—'} b={assessmentB ? `${assessmentB.stabilityRating}/5` : '—'} />
                <ComparisonRow label="הטיית גב" a={assessmentA ? `${assessmentA.backLeanRating}/5` : '—'} b={assessmentB ? `${assessmentB.backLeanRating}/5` : '—'} last />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="media">
            <MediaTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </Screen>
  )
}

function WeekSelect({ labelHe, value, onChange, weeks }: { labelHe: string; value: number; onChange: (w: number) => void; weeks: number[] }) {
  return (
    <label className="block">
      <span className="text-xs text-text-muted">{labelHe}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm"
      >
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((w) => (
          <option key={w} value={w} disabled={!weeks.includes(w)}>
            שבוע {w} {!weeks.includes(w) ? '(אין נתונים)' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

function ComparisonRow({ label, a, b, last }: { label: string; a: string; b: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 text-sm ${!last ? 'border-b border-border' : ''}`}>
      <span className="text-text-muted">{label}</span>
      <span className="font-semibold">
        {a} <span className="text-text-muted font-normal">←</span> {b}
      </span>
    </div>
  )
}
