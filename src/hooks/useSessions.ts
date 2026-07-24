import { useCallback, useEffect, useState } from 'react'
import type { WorkoutSession } from '../types'
import { getAllSessions } from '../lib/db'

export function useSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    const all = await getAllSessions()
    setSessions(all)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { sessions, isLoading, reload }
}
