import { useMemo } from 'react'

import type { ISlide } from '@/typings/slide'

export interface IUseVisibleSlidesOptions {
  readonly slides: readonly ISlide[]
  readonly currentIndex: number
  readonly visibleRadius?: number
}

export interface IUseVisibleSlidesReturn {
  readonly visibleSlides: readonly ISlide[]
  readonly slideOffset: number
  readonly startIndex: number
}

/**
 * Returns a window of slides around the current index for rendering
 * (e.g. current ± visibleRadius) and the offset for transform.
 */
export function useVisibleSlides({
  slides,
  currentIndex,
  visibleRadius = 1,
}: IUseVisibleSlidesOptions): IUseVisibleSlidesReturn {
  return useMemo(() => {
    const startIndex = Math.max(0, currentIndex - visibleRadius)
    const endIndex = Math.min(slides.length - 1, currentIndex + visibleRadius)
    const visibleSlides = slides.slice(startIndex, endIndex + 1)
    const slideOffset = currentIndex - startIndex
    return { visibleSlides, slideOffset, startIndex }
  }, [slides, currentIndex, visibleRadius])
}
