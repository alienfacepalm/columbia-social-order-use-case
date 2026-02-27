import { useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import type { IUseSlideNavOptions, IUseSlideNavReturn } from '@/typings/slide-nav'

function parseSlideIndex(slideNum: string | undefined, total: number): number {
  if (slideNum == null || slideNum === '') return 0
  const n = parseInt(slideNum, 10)
  if (!Number.isFinite(n) || n < 1) return 0
  return Math.min(n - 1, total - 1)
}

export function useSlideNav({ total }: IUseSlideNavOptions): IUseSlideNavReturn {
  const { mode, slideNum } = useParams<{ mode: string; slideNum?: string }>()
  const navigate = useNavigate()

  const index = Math.max(0, Math.min(parseSlideIndex(slideNum, total), total - 1))
  const routeMode = mode === 'simple' || mode === 'advanced' ? mode : 'advanced'

  const go = useCallback(
    (delta: number) => {
      const next = Math.max(1, Math.min(index + 1 + delta, total))
      navigate(`/${routeMode}/${next}`, { replace: true })
    },
    [index, total, routeMode, navigate],
  )

  const goTo = useCallback(
    (slideIndex: number) => {
      const next = Math.max(1, Math.min(slideIndex + 1, total))
      navigate(`/${routeMode}/${next}`, { replace: true })
    },
    [total, routeMode, navigate],
  )

  const goToStart = useCallback(() => {
    navigate(`/${routeMode}/1`, { replace: true })
  }, [routeMode, navigate])

  const goToEnd = useCallback(() => {
    navigate(`/${routeMode}/${total}`, { replace: true })
  }, [routeMode, total, navigate])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
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

