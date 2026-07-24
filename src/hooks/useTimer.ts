import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerMode = 'down' | 'up'

interface UseTimerOptions {
  mode?: TimerMode
  onComplete?: () => void
  onTick?: (seconds: number) => void
}

export interface UseTimerResult {
  seconds: number
  isRunning: boolean
  start: (initialSeconds?: number) => void
  pause: () => void
  resume: () => void
  reset: (newSeconds?: number) => void
  addSeconds: (delta: number) => void
}

/**
 * Wall-clock based timer (drift-free across pause/resume) with count-up or
 * count-down mode. Ticks at 200ms resolution but reports whole seconds.
 */
export function useTimer(initialSeconds: number, options: UseTimerOptions = {}): UseTimerResult {
  const { mode = 'down', onComplete, onTick } = options
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const targetRef = useRef<number | null>(null) // for 'down': ms timestamp when timer hits 0
  const startRef = useRef<number | null>(null) // for 'up': ms timestamp when counting began
  const accumulatedRef = useRef(0) // for 'up': seconds accumulated before the current run
  const remainingRef = useRef(initialSeconds) // for 'down': seconds remaining while paused
  const intervalRef = useRef<number | null>(null)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)
  onCompleteRef.current = onComplete
  onTickRef.current = onTick

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    if (mode === 'down') {
      const remainingMs = (targetRef.current ?? Date.now()) - Date.now()
      const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
      setSeconds(nextSeconds)
      onTickRef.current?.(nextSeconds)
      if (nextSeconds <= 0 && !completedRef.current) {
        completedRef.current = true
        clearTick()
        setIsRunning(false)
        onCompleteRef.current?.()
      }
    } else {
      const elapsedMs = Date.now() - (startRef.current ?? Date.now())
      const nextSeconds = accumulatedRef.current + Math.floor(elapsedMs / 1000)
      setSeconds(nextSeconds)
      onTickRef.current?.(nextSeconds)
    }
  }, [mode, clearTick])

  const start = useCallback(
    (newInitialSeconds?: number) => {
      const base = newInitialSeconds ?? initialSeconds
      completedRef.current = false
      if (mode === 'down') {
        remainingRef.current = base
        targetRef.current = Date.now() + base * 1000
        setSeconds(base)
      } else {
        accumulatedRef.current = base
        startRef.current = Date.now()
        setSeconds(base)
      }
      setIsRunning(true)
      clearTick()
      intervalRef.current = window.setInterval(tick, 200)
    },
    [initialSeconds, mode, tick, clearTick],
  )

  const pause = useCallback(() => {
    if (mode === 'down' && targetRef.current !== null) {
      remainingRef.current = Math.max(0, Math.ceil((targetRef.current - Date.now()) / 1000))
    } else if (mode === 'up' && startRef.current !== null) {
      accumulatedRef.current += Math.floor((Date.now() - startRef.current) / 1000)
    }
    clearTick()
    setIsRunning(false)
  }, [mode, clearTick])

  const resume = useCallback(() => {
    if (mode === 'down') {
      targetRef.current = Date.now() + remainingRef.current * 1000
    } else {
      startRef.current = Date.now()
    }
    setIsRunning(true)
    clearTick()
    intervalRef.current = window.setInterval(tick, 200)
  }, [mode, tick, clearTick])

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTick()
      setIsRunning(false)
      completedRef.current = false
      const base = newSeconds ?? initialSeconds
      remainingRef.current = base
      accumulatedRef.current = base
      targetRef.current = null
      startRef.current = null
      setSeconds(base)
    },
    [initialSeconds, clearTick],
  )

  const addSeconds = useCallback(
    (delta: number) => {
      if (mode === 'down') {
        if (targetRef.current !== null && isRunning) {
          targetRef.current += delta * 1000
          setSeconds((s) => Math.max(0, s + delta))
        } else {
          remainingRef.current = Math.max(0, remainingRef.current + delta)
          setSeconds(remainingRef.current)
        }
      } else {
        accumulatedRef.current += delta
        setSeconds((s) => Math.max(0, s + delta))
      }
    },
    [mode, isRunning],
  )

  useEffect(() => clearTick, [clearTick])

  return { seconds, isRunning, start, pause, resume, reset, addSeconds }
}
