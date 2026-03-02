import type { ReactElement } from 'react'

import type { ISlideNavProps } from '@/typings/slide'
import { truncateTitle } from '@/utils/truncate-title/truncate-title'

/** Shorter labels in footer dropdown so Prev | 1/20 | dropdown | Next stay on one row. */
const FOOTER_DROPDOWN_TITLE_MAX_LENGTH = 18

const NAV_BUTTON_CLASS =
  'flex shrink-0 min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'

/** Footer nav: single inline row so all controls fit on mobile. */
export function SlideNav({
  slides,
  currentIndex,
  onPrevious,
  onNext,
  onGoTo,
  isMobile,
}: ISlideNavProps): ReactElement {
  return (
    <footer className="shrink-0 border-t border-[rgba(102,165,232,0.4)] bg-[#1d3356] safe-area-pb">
      <nav
        className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3 px-2 py-2 sm:px-3 sm:py-3"
        aria-label="Slide navigation"
      >
        <button
          type="button"
          className={NAV_BUTTON_CLASS}
          onClick={onPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <span className="shrink-0 min-w-10 text-center text-xs sm:text-sm text-[#66a5e8] tabular-nums">
          {currentIndex + 1}/{slides.length}
        </span>
        <select
          value={currentIndex}
          onChange={(e) => onGoTo(Number(e.target.value))}
          className="flex-1 min-w-0 min-h-[44px] h-11 sm:h-10 rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] pl-2 pr-9 sm:pl-3 sm:pr-10 text-xs sm:text-sm text-white cursor-pointer hover:bg-[#3385e2] focus:outline-none focus:ring-2 focus:ring-[#66a5e8] appearance-none bg-no-repeat bg-size-[1.125rem_1.125rem] sm:bg-size-[1.25rem_1.25rem] bg-position-[right_0.375rem_center] sm:bg-position-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2366a5e8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] touch-manipulation truncate"
          aria-label="Go to slide"
        >
          {slides.map((slide, i) => {
            const fullTitle = slide.title || (i === 0 ? 'Title' : `Slide ${i + 1}`)
            const label = isMobile ? truncateTitle(fullTitle, FOOTER_DROPDOWN_TITLE_MAX_LENGTH) : fullTitle
            return (
              <option key={i} value={i}>
                {i + 1}. {label}
              </option>
            )
          })}
        </select>
        <button
          type="button"
          className={NAV_BUTTON_CLASS}
          onClick={onNext}
          disabled={currentIndex === slides.length - 1}
          aria-label="Next slide"
        >
          ›
        </button>
      </nav>
    </footer>
  )
}
