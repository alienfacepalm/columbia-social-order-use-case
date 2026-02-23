import type { ReactElement } from 'react'
import { useCallback } from 'react'

import { Slide } from './slide'
import { PresentationHeader } from './presentation-header'
import { SlideNav } from './slide-nav'
import { useSlideNav } from '../hooks/use-slide-nav'
import { useMediaQuery } from '../hooks/use-media-query'
import { useSwipeNavigation } from '../hooks/use-swipe-navigation'
import { parsePresentation } from '../utils/parse-presentation'
import presentationRaw from '../../presentation.md?raw'

const slides = parsePresentation(presentationRaw)

export function App(): ReactElement {
  const { index, go, goTo } = useSlideNav({ total: slides.length })
  const isMobile = useMediaQuery('(max-width: 640px)')

  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeLeft: useCallback(() => go(1), [go]),
    onSwipeRight: useCallback(() => go(-1), [go]),
  })

  return (
    <div
      className="flex h-full flex-col bg-[linear-gradient(135deg,#1d3356_0%,#1d3356_45%,#3385e2_100%)] text-white overflow-hidden"
    >
      <div
        className="flex min-h-0 flex-1 w-full transition-transform duration-300 ease-out touch-pan-y"
        style={{ transform: `translateX(-${index * 100}vw)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.index}
            className="flex flex-shrink-0 w-screen flex-col items-center px-4 pb-4 sm:px-8 sm:pb-6 md:px-16 md:pb-8 h-full box-border min-w-0"
          >
            <PresentationHeader />
            <Slide slide={slide} slideIndex={i} />
          </div>
        ))}
      </div>

      <SlideNav
        slides={slides}
        currentIndex={index}
        onPrevious={() => go(-1)}
        onNext={() => go(1)}
        onGoTo={goTo}
        isMobile={isMobile}
      />
    </div>
  )
}
