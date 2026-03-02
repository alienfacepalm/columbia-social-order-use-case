import { useMemo } from 'react'

import type { ISlide } from '@/typings/slide'
import { parsePresentation, mergePresentationWithSimple } from '@/utils/parse-presentation/parse-presentation'

/**
 * Parses and merges two presentation markdown strings into a single slides array.
 * Memoized so parsing runs only when the raw strings change.
 */
export function usePresentationSlides(
  advancedRaw: string,
  simpleRaw: string,
): readonly ISlide[] {
  return useMemo(
    () =>
      mergePresentationWithSimple(
        parsePresentation(advancedRaw),
        parsePresentation(simpleRaw),
      ),
    [advancedRaw, simpleRaw],
  )
}
