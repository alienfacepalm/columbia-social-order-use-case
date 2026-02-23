import { useState, useEffect, useCallback } from 'react'

const HASH_PREFIX = 'slide-'

function parseSlideFromHash(total: number): number {
  const hash = window.location.hash.slice(1)
  if (!hash.startsWith(HASH_PREFIX)) return 0
  const n = parseInt(hash.slice(HASH_PREFIX.length), 10)
  if (!Number.isFinite(n) || n < 1) return 0
  return Math.min(n - 1, total - 1)
}

function slideToHash(index: number): string {
  return `#${HASH_PREFIX}${index + 1}`
}

export interface UseSlideNavOptions {
  readonly total: number
}

export interface UseSlideNavReturn {
  readonly index: number
  readonly go: (delta: number) => void
  readonly goTo: (slideIndex: number) => void
  readonly goToStart: () => void
  readonly goToEnd: () => void
}

export function useSlideNav({ total }: UseSlideNavOptions): UseSlideNavReturn {
  const [current, setCurrent] = useState(() => parseSlideFromHash(total))
  const index = Math.max(0, Math.min(current, total - 1))

  // Sync URL hash when slide changes
  useEffect(() => {
    const expected = slideToHash(index)
    if (window.location.hash !== expected) {
      window.history.replaceState(null, '', expected)
    }
  }, [index])

  // React to hash changes (back/forward, manual URL edit)
  useEffect(() => {
    const onHashChange = (): void => {
      setCurrent(parseSlideFromHash(total))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [total])

  const go = useCallback((delta: number) => {
    setCurrent((c) => Math.max(0, Math.min(c + delta, total - 1)))
  }, [total])

  const goTo = useCallback((slideIndex: number) => {
    setCurrent(Math.max(0, Math.min(slideIndex, total - 1)))
  }, [total])

  const goToStart = useCallback(() => setCurrent(0), [])
  const goToEnd = useCallback(() => setCurrent(total - 1), [total])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      // Ignore when typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToStart()
      } else if (e.key === 'End') {
        e.preventDefault()
        goToEnd()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, goToStart, goToEnd])

  return { index, go, goTo, goToStart, goToEnd }
}
