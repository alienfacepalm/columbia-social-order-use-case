import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useMediaQuery } from './use-media-query'

describe('useMediaQuery', () => {
  const mockMatchMedia = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('matchMedia', mockMatchMedia)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns initial match result from matchMedia', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const { result } = renderHook(() => useMediaQuery('(max-width: 640px)'))
    expect(result.current).toBe(true)
  })

  it('returns false when media does not match', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(result.current).toBe(false)
  })

  it('subscribes to change and cleans up', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    })
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 640px)'))
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
