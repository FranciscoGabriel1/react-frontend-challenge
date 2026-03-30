import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    rerender({ value: 'updated', delay: 500 })

    act(() => { vi.advanceTimersByTime(200) })

    expect(result.current).toBe('initial')
  })

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    rerender({ value: 'updated', delay: 500 })

    act(() => { vi.advanceTimersByTime(500) })

    expect(result.current).toBe('updated')
  })

  it('resets timer on rapid consecutive changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 500 } },
    )

    rerender({ value: 'ab', delay: 500 })
    act(() => { vi.advanceTimersByTime(200) })

    rerender({ value: 'abc', delay: 500 })
    act(() => { vi.advanceTimersByTime(200) })

    expect(result.current).toBe('a')

    act(() => { vi.advanceTimersByTime(500) })

    expect(result.current).toBe('abc')
  })
})
