import type { ReactElement } from 'react'

import type { ISlideNavProps } from '../../typings/slide'
import { MOBILE_TITLE_MAX_LENGTH } from '../config/app/app'
import { truncateTitle } from '../utils/truncate-title/truncate-title'

const NAV_BUTTON_CLASS =
  'flex min-h-[44px] min-w-[44px] h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'

export function SlideNav({
  slides,
  currentIndex,
  onPrevious,
  onNext,
  onGoTo,
  isMobile,
}: ISlideNavProps): ReactElement {
  return (
    <nav className="flex shrink-0 items-center justify-center flex-wrap gap-2 sm:gap-4 bg-[#1d3356] border-t border-[rgba(102,165,232,0.4)] p-2 sm:p-3 safe-area-pb">
      <button
        type="button"
        className={NAV_BUTTON_CLASS}
        onClick={onPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <span className="min-w-12 sm:min-w-16 text-center text-xs sm:text-sm text-[#66a5e8]">
        {currentIndex + 1} / {slides.length}
      </span>
      <select
        value={currentIndex}
        onChange={(e) => onGoTo(Number(e.target.value))}
        className="min-h-[44px] min-w-0 h-11 sm:h-10 max-w-[70vw] sm:max-w-none rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] pl-3 pr-10 sm:pr-12 text-sm text-white cursor-pointer hover:bg-[#3385e2] focus:outline-none focus:ring-2 focus:ring-[#66a5e8] appearance-none bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] sm:bg-position-[right_0.75rem_center] bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2366a5e8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] touch-manipulation"
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
        className={NAV_BUTTON_CLASS}
        onClick={onNext}
        disabled={currentIndex === slides.length - 1}
        aria-label="Next slide"
      >
        ›
      </button>
    </nav>
  )
}
