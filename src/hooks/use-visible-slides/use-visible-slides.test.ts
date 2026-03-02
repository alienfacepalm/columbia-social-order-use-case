import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useVisibleSlides } from './use-visible-slides'

const mockSlides = [
  { title: 'A', content: [], index: 0, durationSeconds: 60 },
  { title: 'B', content: [], index: 1, durationSeconds: 60 },
  { title: 'C', content: [], index: 2, durationSeconds: 60 },
  { title: 'D', content: [], index: 3, durationSeconds: 60 },
] as const

describe('useVisibleSlides', () => {
  it('returns a window of slides around current index', () => {
    const { result } = renderHook(() =>
      useVisibleSlides({
        slides: mockSlides,
        currentIndex: 1,
        visibleRadius: 1,
      }),
    )
    expect(result.current.visibleSlides).toHaveLength(3)
    expect(result.current.visibleSlides.map((s) => s.title)).toEqual([
      'A',
      'B',
      'C',
    ])
    expect(result.current.slideOffset).toBe(1)
    expect(result.current.startIndex).toBe(0)
  })

  it('clamps start and end to slide bounds', () => {
    const { result } = renderHook(() =>
      useVisibleSlides({
        slides: mockSlides,
        currentIndex: 0,
        visibleRadius: 1,
      }),
    )
    expect(result.current.startIndex).toBe(0)
    expect(result.current.visibleSlides).toHaveLength(2)
    expect(result.current.slideOffset).toBe(0)
  })

  it('uses default visibleRadius of 1', () => {
    const { result } = renderHook(() =>
      useVisibleSlides({
        slides: mockSlides,
        currentIndex: 2,
      }),
    )
    expect(result.current.visibleSlides).toHaveLength(3)
    expect(result.current.startIndex).toBe(1)
  })
})
