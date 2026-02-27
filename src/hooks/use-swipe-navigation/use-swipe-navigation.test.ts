import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useSwipeNavigation } from './use-swipe-navigation'
import { SWIPE_THRESHOLD_PX } from '@/config/app/app'

describe('useSwipeNavigation', () => {
  it('calls onSwipeLeft when swipe exceeds threshold to the left', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, onSwipeRight }),
    )

    const startEvent = {
      touches: [{ clientX: 0 }],
    } as unknown as React.TouchEvent
    const endEvent = {
      changedTouches: [{ clientX: -((SWIPE_THRESHOLD_PX) + 10) }],
    } as unknown as React.TouchEvent
    act(() => {
      result.current.onTouchStart(startEvent)
    })
    act(() => {
      result.current.onTouchEnd(endEvent)
    })

    expect(onSwipeLeft).toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('calls onSwipeRight when swipe exceeds threshold to the right', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()

    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, onSwipeRight }),
    )

    const startEvent = {
      touches: [{ clientX: 0 }],
    } as unknown as React.TouchEvent
    const endEvent = {
      changedTouches: [{ clientX: SWIPE_THRESHOLD_PX + 10 }],
    } as unknown as React.TouchEvent
    act(() => {
      result.current.onTouchStart(startEvent)
    })
    act(() => {
      result.current.onTouchEnd(endEvent)
    })

    expect(onSwipeRight).toHaveBeenCalled()
    expect(onSwipeLeft).not.toHaveBeenCalled()
  })
})

