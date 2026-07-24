import { useCallback, useEffect, useState } from 'react'
import type { WeeklyAssessment } from '../types'
import { getAllWeeklyAssessments } from '../lib/db'

export function useWeeklyAssessments() {
  const [assessments, setAssessments] = useState<WeeklyAssessment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    const all = await getAllWeeklyAssessments()
    setAssessments(all)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { assessments, isLoading, reload }
}
