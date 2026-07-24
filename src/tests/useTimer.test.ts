import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimer } from '../hooks/useTimer'

describe('useTimer (count down)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down from the initial value', () => {
    const { result } = renderHook(() => useTimer(10, { mode: 'down' }))

    act(() => result.current.start())
    expect(result.current.seconds).toBe(10)

    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.seconds).toBe(7)
  })

  it('calls onComplete and stops at zero', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(3, { mode: 'down', onComplete }))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3200))

    expect(result.current.seconds).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('freezes remaining time while paused, then resumes correctly', () => {
    const { result } = renderHook(() => useTimer(10, { mode: 'down' }))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.pause())
    const secondsAtPause = result.current.seconds

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.seconds).toBe(secondsAtPause)

    act(() => result.current.resume())
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.seconds).toBe(secondsAtPause - 2)
  })

  it('adds seconds without exceeding expectations', () => {
    const { result } = renderHook(() => useTimer(10, { mode: 'down' }))
    act(() => result.current.start())
    act(() => result.current.addSeconds(10))
    expect(result.current.seconds).toBe(20)
  })
})

describe('useTimer (count up)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts up from zero', () => {
    const { result } = renderHook(() => useTimer(0, { mode: 'up' }))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.seconds).toBe(4)
  })
})
