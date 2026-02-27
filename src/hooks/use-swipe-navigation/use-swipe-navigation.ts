import { useRef, useCallback } from 'react'

import type {
  IUseSwipeNavigationOptions,
  IUseSwipeNavigationReturn,
} from '@/typings/swipe-navigation'
import { SWIPE_THRESHOLD_PX } from '@/config/app/app'

/**
 * Handles touch swipe left/right and invokes callbacks when threshold is exceeded.
 */
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
}: IUseSwipeNavigationOptions): IUseSwipeNavigationReturn {
  const touchStartX = useRef<number | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const endX = e.changedTouches[0].clientX
      const delta = touchStartX.current - endX
      touchStartX.current = null
      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
        if (delta > 0) onSwipeLeft()
        else onSwipeRight()
      }
    },
    [onSwipeLeft, onSwipeRight]
  )

  return { onTouchStart, onTouchEnd }
}

