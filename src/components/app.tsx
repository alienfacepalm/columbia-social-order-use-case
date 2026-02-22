import type { ReactElement } from 'react'
import { Slide } from './slide'
import { useSlideNav } from '../hooks/use-slide-nav'
import { parsePresentation } from '../utils/parse-presentation'
import presentationRaw from '../../presentation.md?raw'

const slides = parsePresentation(presentationRaw)

export function App(): ReactElement {
  const { index, go } = useSlideNav({ total: slides.length })

  return (
    <div className="app">
      <div
        className="slides-track"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.index} className="slide-container">
            <div className="slide-use-case">
              <img
                src="/logo.png"
                alt="Columbia Sportswear"
                className="slide-use-case-logo"
                width={320}
                height={68}
              />
              <span className="slide-use-case-label">Social Order Use Case</span>
            </div>
            <Slide slide={slide} slideIndex={i} />
          </div>
        ))}
      </div>

      <nav className="nav">
        <button
          type="button"
          className="nav-btn"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <span className="nav-counter">
          {index + 1} / {slides.length}
        </span>
        <button
          type="button"
          className="nav-btn"
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
