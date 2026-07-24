import { useCallback } from 'react'

type BuzzKind = 'start' | 'warning' | 'finish' | 'tap'

const PATTERNS: Record<BuzzKind, number | number[]> = {
  start: 80,
  warning: [60, 60, 60],
  finish: [100, 60, 100, 60, 100],
  tap: 30,
}

export function useVibration(enabled: boolean) {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const vibrate = useCallback(
    (kind: BuzzKind) => {
      if (!enabled || !isSupported) return
      try {
        navigator.vibrate(PATTERNS[kind])
      } catch {
        /* ignore unsupported */
      }
    },
    [enabled, isSupported],
  )

  return {
    isSupported,
    vibrateStart: () => vibrate('start'),
    vibrateWarning: () => vibrate('warning'),
    vibrateFinish: () => vibrate('finish'),
    vibrateTap: () => vibrate('tap'),
  }
}
