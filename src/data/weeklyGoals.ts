export interface WeekGoal {
  weeks: number[]
  titleHe: string
  pointsHe: string[]
}

export const WEEK_GOALS: WeekGoal[] = [
  {
    weeks: [1, 2],
    titleHe: 'שבועות 1–2: לימוד התנועה',
    pointsHe: ['לימוד התנועה', 'טווח נוח', 'שימוש מלא בתמיכה', 'עצימות בעיטות עד 40%'],
  },
  {
    weeks: [3, 4],
    titleHe: 'שבועות 3–4: הוספת נפח',
    pointsHe: ['הוספת חזרות', 'החזקות ארוכות יותר', 'העלאה קלה של גובה המטרה'],
  },
  {
    weeks: [5, 6],
    titleHe: 'שבועות 5–6: פחות תמיכה',
    pointsHe: ['פחות תמיכה ביד', 'עבודה אקסצנטרית איטית', 'יותר שליטה בטווח'],
  },
  {
    weeks: [7],
    titleHe: 'שבוע 7: עומס מתון',
    pointsHe: ['שבוע עומס מתון', 'ניסיון לטווח גבוה יותר', 'הפחתת נפח בכ־20%', 'צילום בעיטות לבדיקה'],
  },
  {
    weeks: [8],
    titleHe: 'שבוע 8: בדיקת התקדמות',
    pointsHe: ['בדיקת התקדמות', 'השוואה לשבוע הראשון', 'ביצוע בעיטות בעצימות 60%–70%'],
  },
]

export function getWeekGoal(week: number): WeekGoal {
  return WEEK_GOALS.find((g) => g.weeks.includes(week)) ?? WEEK_GOALS[0]
}

export const MOTIVATIONAL_QUOTES_HE: string[] = [
  'גובה אמיתי מגיע משליטה, לא מתנופה.',
  'טווח שאי אפשר לשלוט בו אינו טווח שימושי.',
  'קודם טכניקה, אחר כך גובה.',
  'עקביות מנצחת עצימות חד־פעמית.',
  'רגל הציר מספרת את הסיפור האמיתי של הבעיטה.',
  'כל ס"מ נוסף נבנה בסבלנות, לא בכוח.',
]

export function getQuoteForDay(date: Date = new Date()): string {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  return MOTIVATIONAL_QUOTES_HE[dayIndex % MOTIVATIONAL_QUOTES_HE.length]
}
