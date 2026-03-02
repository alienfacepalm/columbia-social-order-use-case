import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'

import { usePresentationSlides } from './use-presentation-slides'

describe('usePresentationSlides', () => {
  it('parses and merges two markdown strings into slides', () => {
    const advanced = `## First
Content

---
## Second
More`
    const simple = `## First
Simple content

---
## Second
Simple more`
    const { result } = renderHook(() =>
      usePresentationSlides(advanced, simple),
    )
    expect(result.current).toHaveLength(2)
    expect(result.current[0].title).toBe('First')
    expect(result.current[0].contentSimple).toBeDefined()
    expect(result.current[1].title).toBe('Second')
  })

  it('memoizes result when inputs are stable', () => {
    const raw = '## One\nBody'
    const { result, rerender } = renderHook(
      ({ a, b }) => usePresentationSlides(a, b),
      { initialProps: { a: raw, b: raw } },
    )
    const first = result.current
    rerender({ a: raw, b: raw })
    expect(result.current).toBe(first)
  })
})
