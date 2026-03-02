import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useSpeakerTimerShortcut } from './use-speaker-timer-shortcut'

describe('useSpeakerTimerShortcut', () => {
  it('returns initial visibility false', () => {
    const { result } = renderHook(() => useSpeakerTimerShortcut())
    expect(result.current[0]).toBe(false)
  })

  it('toggles visibility when Shift+T is dispatched', () => {
    const { result } = renderHook(() => useSpeakerTimerShortcut())

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'T', shiftKey: true }),
      )
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 't', shiftKey: true }),
      )
    })
    expect(result.current[0]).toBe(false)
  })

  it('setter updates visibility', () => {
    const { result } = renderHook(() => useSpeakerTimerShortcut())

    act(() => {
      result.current[1](true)
    })
    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1](false)
    })
    expect(result.current[0]).toBe(false)
  })
})
