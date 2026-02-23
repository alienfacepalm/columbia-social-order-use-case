import type { ReactElement } from 'react'
import { useRef, useCallback } from 'react'
import { Slide } from './slide'
import { useSlideNav } from '../hooks/use-slide-nav'
import { useMediaQuery } from '../hooks/use-media-query'
import { parsePresentation } from '../utils/parse-presentation'
import { truncateTitle } from '../utils/truncate-title'
import presentationRaw from '../../presentation.md?raw'

const slides = parsePresentation(presentationRaw)
const MOBILE_TITLE_MAX_LENGTH = 24
const SWIPE_THRESHOLD_PX = 50

export function App(): ReactElement {
  const { index, go, goTo } = useSlideNav({ total: slides.length })
  const isMobile = useMediaQuery('(max-width: 640px)')
  const touchStartX = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const endX = e.changedTouches[0].clientX
      const delta = touchStartX.current - endX
      touchStartX.current = null
      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
        if (delta > 0) go(1)
        else go(-1)
      }
    },
    [go]
  )

  return (
    <div
      className="flex h-full flex-col bg-[linear-gradient(135deg,#1d3356_0%,#1d3356_45%,#3385e2_100%)] text-white overflow-hidden"
    >
      <div
        className="flex min-h-0 flex-1 w-full transition-transform duration-300 ease-out touch-pan-y"
        style={{ transform: `translateX(-${index * 100}vw)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.index}
            className="flex flex-shrink-0 w-screen flex-col items-center px-4 pb-4 sm:px-8 sm:pb-6 md:px-16 md:pb-8 h-full box-border min-w-0"
          >
            <div className="flex flex-shrink-0 flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 py-2 pt-3 sm:py-3 sm:pt-4">
              <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                <img
                  src="/logo.png"
                  alt="Columbia Sportswear"
                  className="block h-12 w-auto sm:h-14 md:h-[6.67rem] m-0 ml-2 sm:ml-4 md:ml-[40px] align-middle brightness-0 invert"
                  width={320}
                  height={68}
                />
                <span className="text-[0.7rem] sm:text-[0.8rem] font-medium uppercase tracking-[0.1em] leading-tight text-white/95">
                  Social Order Use Case
                </span>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-0.5 sm:gap-1">
                <span className="text-[0.65rem] sm:text-xs font-normal leading-tight text-white/90">
                  Prepared for Echodyne Interview by Brandon Pliska
                </span>
                <a
                  href="https://github.com/alienfacepalm/columbia-social-order-use-case"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.65rem] sm:text-xs font-normal leading-tight text-[#66a5e8] hover:text-[#99c4f0] underline break-all"
                >
                  <span className="hidden sm:inline">github.com/alienfacepalm/columbia-social-order-use-case</span>
                  <span className="sm:hidden">GitHub repo</span>
                </a>
              </div>
            </div>
            <Slide slide={slide} slideIndex={i} />
          </div>
        ))}
      </div>

      <nav className="flex flex-shrink-0 items-center justify-center flex-wrap gap-2 sm:gap-4 bg-[#1d3356] border-t border-[rgba(102,165,232,0.4)] p-2 sm:p-3 safe-area-pb">
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <span className="min-w-12 sm:min-w-16 text-center text-xs sm:text-sm text-[#66a5e8]">
          {index + 1} / {slides.length}
        </span>
        <select
          value={index}
          onChange={(e) => goTo(Number(e.target.value))}
          className="min-h-[44px] min-w-0 h-11 sm:h-10 max-w-[50vw] sm:max-w-none rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] pl-3 pr-10 sm:pr-12 text-sm text-white cursor-pointer hover:bg-[#3385e2] focus:outline-none focus:ring-2 focus:ring-[#66a5e8] appearance-none bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] sm:bg-[right_0.75rem_center] bg-no-repeat [background-image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2366a5e8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] touch-manipulation"
          aria-label="Go to slide"
        >
          {slides.map((slide, i) => {
            const fullTitle = slide.title || (i === 0 ? 'Title' : `Slide ${i + 1}`)
            const label = isMobile ? truncateTitle(fullTitle, MOBILE_TITLE_MAX_LENGTH) : fullTitle
            return (
              <option key={i} value={i}>
                {i + 1}. {label}
              </option>
            )
          })}
        </select>
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
          onClick={() => go(1)}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </div>
  )
}
