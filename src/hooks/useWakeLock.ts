import { useCallback, useEffect, useRef, useState } from 'react'

export function useWakeLock(active: boolean) {
  const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [isActive, setIsActive] = useState(false)
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const requestLock = useCallback(async () => {
    if (!isSupported) return
    try {
      const sentinel = await navigator.wakeLock.request('screen')
      sentinelRef.current = sentinel
      setIsActive(true)
      sentinel.addEventListener('release', () => setIsActive(false))
    } catch {
      setIsActive(false)
    }
  }, [isSupported])

  const releaseLock = useCallback(async () => {
    try {
      await sentinelRef.current?.release()
    } catch {
      /* already released */
    }
    sentinelRef.current = null
    setIsActive(false)
  }, [])

  useEffect(() => {
    if (!active) {
      releaseLock()
      return
    }
    requestLock()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && active) requestLock()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      releaseLock()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return { isSupported, isActive }
}
