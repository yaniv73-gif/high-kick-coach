import { useCallback, useRef } from 'react'

type BeepKind = 'start' | 'warning' | 'finish' | 'tap'

const BEEP_PRESETS: Record<BeepKind, { freq: number; durationMs: number; count: number }> = {
  start: { freq: 880, durationMs: 140, count: 1 },
  warning: { freq: 660, durationMs: 100, count: 2 },
  finish: { freq: 520, durationMs: 220, count: 3 },
  tap: { freq: 740, durationMs: 60, count: 1 },
}

/** Synthesizes short beeps via WebAudio — no external audio assets required. */
export function useSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new Ctx()
    }
    return audioCtxRef.current
  }, [])

  const play = useCallback(
    (kind: BeepKind) => {
      if (!enabled) return
      try {
        const ctx = getContext()
        if (ctx.state === 'suspended') ctx.resume()
        const { freq, durationMs, count } = BEEP_PRESETS[kind]
        for (let i = 0; i < count; i++) {
          const startTime = ctx.currentTime + i * (durationMs / 1000 + 0.08)
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.value = freq
          gain.gain.setValueAtTime(0.0001, startTime)
          gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.01)
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationMs / 1000)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(startTime)
          osc.stop(startTime + durationMs / 1000 + 0.02)
        }
      } catch {
        /* WebAudio unavailable — fail silently */
      }
    },
    [enabled, getContext],
  )

  return {
    playStart: () => play('start'),
    playWarning: () => play('warning'),
    playFinish: () => play('finish'),
    playTap: () => play('tap'),
  }
}
