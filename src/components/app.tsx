import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { Slide } from './slide'
import { PresentationHeader } from './presentation-header'
import { SlideNav } from './slide-nav'
import { SpeakerTimer } from './speaker-timer'
import { PresentationModeProvider } from '@/contexts/presentation-mode-context/presentation-mode-context'
import { useSlideNav } from '@/hooks/use-slide-nav/use-slide-nav'
import { useMediaQuery } from '@/hooks/use-media-query/use-media-query'
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation/use-swipe-navigation'
import { usePresentationSlides } from '@/hooks/use-presentation-slides/use-presentation-slides'
import { usePresentationRouteRedirect } from '@/hooks/use-presentation-route-redirect/use-presentation-route-redirect'
import { useSpeakerTimerShortcut } from '@/hooks/use-speaker-timer-shortcut/use-speaker-timer-shortcut'
import { useVisibleSlides } from '@/hooks/use-visible-slides/use-visible-slides'
import presentationRaw from '../../presentation/advanced.md?raw'
import presentationSimpleRaw from '../../presentation/simple.md?raw'

export function App(): ReactElement {
  usePresentationRouteRedirect()

  const slides = usePresentationSlides(presentationRaw, presentationSimpleRaw)
  const { index, go, goTo } = useSlideNav({ total: slides.length })
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [isTimerVisible] = useSpeakerTimerShortcut()
  const { visibleSlides, slideOffset, startIndex } = useVisibleSlides({
    slides,
    currentIndex: index,
    visibleRadius: 1,
  })

  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeLeft: useCallback(() => go(1), [go]),
    onSwipeRight: useCallback(() => go(-1), [go]),
  })

  return (
    <PresentationModeProvider>
      <div
        className="relative flex h-full w-full max-w-full min-w-0 flex-col bg-[linear-gradient(135deg,#1d3356_0%,#1d3356_45%,#3385e2_100%)] text-white overflow-x-hidden overflow-y-hidden"
      >
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex w-full justify-center px-3 pt-3 sm:px-8 sm:pt-6 md:px-16 md:pt-8 box-border safe-area-pt">
          <div className="pointer-events-auto w-full max-w-6xl">
            <PresentationHeader />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 min-w-0 overflow-hidden slide-content-pt">
          <div className="w-full h-full overflow-hidden">
            <div
              className="flex flex-nowrap h-full transition-transform duration-300 ease-out touch-pan-y"
              style={{
                width: `${visibleSlides.length * 100}%`,
                transform: `translateX(-${(slideOffset / visibleSlides.length) * 100}%)`,
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              aria-live="polite"
            >
              {visibleSlides.map((slide, localIndex) => {
                const absoluteIndex = startIndex + localIndex
                return (
                  <div
                    key={slide.index}
                    className="flex shrink-0 grow-0 flex-col items-center px-4 pb-4 sm:px-8 sm:pb-6 md:px-16 md:pb-8 h-full box-border min-w-0"
                    style={{ width: `${100 / visibleSlides.length}%` }}
                  >
                    <Slide slide={slide} slideIndex={absoluteIndex} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {slides[index] && isTimerVisible ? (
          <SpeakerTimer
            key={index}
            durationSeconds={slides[index].durationSeconds}
            slideIndex={index}
          />
        ) : null}
        <SlideNav
          slides={slides}
          currentIndex={index}
          onPrevious={useCallback(() => go(-1), [go])}
          onNext={useCallback(() => go(1), [go])}
          onGoTo={goTo}
          isMobile={isMobile}
        />
      </div>
    </PresentationModeProvider>
  )
}
