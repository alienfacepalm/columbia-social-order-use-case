import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { Slide } from './slide'
import { PresentationHeader } from './presentation-header'
import { SlideNav } from './slide-nav'
import { SpeakerTimer } from './speaker-timer'
import { PresentationModeProvider } from '../contexts/presentation-mode-context'
import { useSlideNav } from '../hooks/use-slide-nav'
import { useMediaQuery } from '../hooks/use-media-query'
import { useSwipeNavigation } from '../hooks/use-swipe-navigation'
import { parsePresentation, mergePresentationWithSimple } from '../utils/parse-presentation'
import presentationRaw from '../../presentation/advanced.md?raw'
import presentationSimpleRaw from '../../presentation/simple.md?raw'

const slides = mergePresentationWithSimple(
  parsePresentation(presentationRaw),
  parsePresentation(presentationSimpleRaw),
)

export function App(): ReactElement {
  const { mode, slideNum } = useParams<{ mode: string; slideNum?: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== 'simple' && mode !== 'advanced') {
      navigate(`/advanced/${slideNum ?? '1'}`, { replace: true })
    }
  }, [mode, slideNum, navigate])

  const { index, go, goTo } = useSlideNav({ total: slides.length })
  const isMobile = useMediaQuery('(max-width: 640px)')

  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeLeft: useCallback(() => go(1), [go]),
    onSwipeRight: useCallback(() => go(-1), [go]),
  })

  return (
    <PresentationModeProvider>
    <div
      className="flex h-full w-full max-w-full min-w-0 flex-col bg-[linear-gradient(135deg,#1d3356_0%,#1d3356_45%,#3385e2_100%)] text-white overflow-x-hidden overflow-y-hidden"
    >
      <div
        className="flex min-h-0 flex-1 w-full min-w-0 transition-transform duration-300 ease-out touch-pan-y"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.index}
            className="flex flex-shrink-0 flex-grow-0 w-full basis-full flex-col items-center px-4 pb-4 sm:px-8 sm:pb-6 md:px-16 md:pb-8 h-full box-border min-w-0 max-w-full"
          >
            <PresentationHeader />
            <Slide slide={slide} slideIndex={i} />
          </div>
        ))}
      </div>

      {slides[index] ? (
        <SpeakerTimer
          key={index}
          durationSeconds={slides[index].durationSeconds}
          slideIndex={index}
        />
      ) : null}
      <SlideNav
        slides={slides}
        currentIndex={index}
        onPrevious={() => go(-1)}
        onNext={() => go(1)}
        onGoTo={goTo}
        isMobile={isMobile}
      />
    </div>
    </PresentationModeProvider>
  )
}
