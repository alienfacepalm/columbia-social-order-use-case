import type { ReactElement } from 'react'
import { Slide } from './slide'
import { useSlideNav } from '../hooks/use-slide-nav'
import { parsePresentation } from '../utils/parse-presentation'
import presentationRaw from '../../presentation.md?raw'

const slides = parsePresentation(presentationRaw)

export function App(): ReactElement {
  const { index, go } = useSlideNav({ total: slides.length })

  return (
    <div
      className="flex h-full flex-col bg-[linear-gradient(135deg,#1d3356_0%,#1d3356_45%,#3385e2_100%)] font-sans text-white"
    >
      <div
        className="flex min-h-0 flex-1 w-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.index}
            className="flex flex-shrink-0 w-screen flex-col items-center px-16 pb-8 h-full box-border"
          >
            <div className="flex flex-shrink-0 flex-row items-center justify-between w-full py-3 pt-4">
              <div className="flex flex-col items-start gap-1">
                <img
                  src="/logo.png"
                  alt="Columbia Sportswear"
                  className="block h-[6.67rem] w-auto m-0 ml-[40px] align-middle brightness-0 invert"
                  width={320}
                  height={68}
                />
                <span className="text-[0.8rem] font-medium uppercase tracking-[0.1em] leading-tight text-white/95">
                  Social Order Use Case
                </span>
              </div>
              <span className="text-xs font-normal leading-none text-white/90">
                🎯 Prepared for Echodyne Interview by Brandon Pliska
              </span>
            </div>
            <Slide slide={slide} slideIndex={i} />
          </div>
        ))}
      </div>

      <nav className="flex flex-shrink-0 items-center justify-center gap-4 bg-[#1d3356] border-t border-[rgba(102,165,232,0.4)] p-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <span className="min-w-16 text-center text-sm text-[#66a5e8]">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#66a5e8] bg-[rgba(43,65,106,0.8)] text-2xl leading-none text-white cursor-pointer hover:bg-[#3385e2] hover:border-[#66a5e8] disabled:opacity-40 disabled:cursor-not-allowed"
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
