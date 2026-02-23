import type { ReactElement } from 'react'
import type { InlineSpan, Slide as SlideModel, SlideContentNode } from '../models/slide'
import { getSlideImage, getSlideImagePosition, IMAGE_SIZE_PX } from '../config/slide-images'
import { MermaidSlide } from './mermaid-slide'
import { parseInline } from '../utils/parse-presentation'

function renderInline(inlines: readonly InlineSpan[]): ReactElement[] {
  return inlines.map((span, j) => {
    if (span.type === 'bold') {
      return (
        <strong key={j}>
          {renderInline(parseInline(span.value))}
        </strong>
      )
    }
    if (span.type === 'link') {
      const isExternal =
        span.href.startsWith('http://') || span.href.startsWith('https://')
      return isExternal ? (
        <a
          key={j}
          href={span.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#66a5e8] underline hover:text-[#99c4f0]"
        >
          {span.value}
        </a>
      ) : (
        <span key={j}>{span.value}</span>
      )
    }
    return <span key={j}>{span.value}</span>
  })
}

export interface SlideProps {
  readonly slide: SlideModel
  readonly slideIndex: number
}

function hasDiagram(slide: SlideModel): boolean {
  return slide.content.some((node) => node.type === 'mermaid')
}

/** Use full-size diagram only when slide has no list (diagram-only or diagram + short text). */
function useFullSizeDiagram(slide: SlideModel): boolean {
  return hasDiagram(slide) && !slide.content.some((node) => node.type === 'ul')
}

export function Slide({ slide, slideIndex }: SlideProps): ReactElement {
  const imageConfig = getSlideImage(slideIndex)
  const imagePosition = getSlideImagePosition(slideIndex)
  const isDiagramSlide = hasDiagram(slide)
  const fullSizeDiagram = useFullSizeDiagram(slide)
  const isTitleSlide = slideIndex === 0

  if (isTitleSlide) {
    return (
      <section className="relative flex flex-1 w-full min-h-0 overflow-auto mt-4 sm:mt-8 px-4 sm:px-8 py-6 sm:py-12 rounded-xl flex-col items-center justify-center max-w-4xl">
        <p className="text-base sm:text-lg md:text-xl font-medium tracking-wide text-white/95 text-center m-0 mb-3 sm:mb-4">
          Columbia Sportswear: Social-Order Initiative
        </p>
        <img
          src="/title.png"
          alt="Presentation title"
          className="block w-full max-w-2xl object-contain max-h-[50vh] sm:max-h-[65vh] scale-[0.81]"
        />
        <h1 className="slide-title-main absolute bottom-[36px] sm:bottom-[60px] left-0 right-0 text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-center m-0 px-3 sm:px-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          High‑Reliability Real‑Time System Design
        </h1>
      </section>
    )
  }

  return (
    <section
      className={`flex flex-1 w-full min-h-0 overflow-auto mt-4 sm:mt-8 px-4 sm:px-8 py-4 sm:py-7 bg-black/20 border border-white/15 rounded-lg flex-col ${isDiagramSlide ? 'max-w-6xl' : 'max-w-4xl'}`}
    >
      {slide.title && (
        <div className="flex justify-end mb-2 flex-shrink-0">
          <h2 className="slide-section-title text-[0.65rem] sm:text-xs font-semibold leading-tight text-white/95 m-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            {renderInline(parseInline(slide.title))}
          </h2>
        </div>
      )}
      <div
        className={
          isDiagramSlide
            ? 'flex-1 min-h-0 flex flex-col min-w-0'
            : `flex w-full gap-4 sm:gap-6 items-start flex-1 min-h-0 min-w-0 flex-col md:flex-row ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`
        }
      >
        <div
          className={
            isDiagramSlide ? 'flex-1 min-h-0 flex flex-col min-w-0' : 'flex-1 min-w-0'
          }
        >
          {slide.content.map((node, i) => (
            <SlideNode
              key={i}
              node={node}
              slideIndex={slideIndex}
              nodeIndex={i}
              isDiagramSlide={isDiagramSlide}
              fullSizeDiagram={fullSizeDiagram}
            />
          ))}
        </div>
        {!isDiagramSlide && imageConfig && (
          <div className="slide-illustration-wrap flex-shrink-0 w-full max-w-[280px] md:w-[280px] min-h-[160px] sm:min-h-[200px] flex items-center justify-center">
            <img
              src={imageConfig.src}
              alt={imageConfig.alt}
              className={`slide-illustration object-contain object-center w-auto h-auto max-h-[160px] sm:max-h-[200px] ${
                imageConfig.size === 's' ? 'max-w-[130px]' : imageConfig.size === 'm' ? 'max-w-[200px]' : 'max-w-[260px]'
              }`}
              width={IMAGE_SIZE_PX[imageConfig.size]}
              height={200}
            />
          </div>
        )}
      </div>
    </section>
  )
}

interface SlideNodeProps {
  readonly node: SlideContentNode
  readonly slideIndex: number
  readonly nodeIndex: number
  readonly isDiagramSlide: boolean
  readonly fullSizeDiagram: boolean
}

function SlideNode({ node, slideIndex, nodeIndex, fullSizeDiagram }: SlideNodeProps): ReactElement | null {
  if (node.type === 'mermaid') {
    return (
      <MermaidSlide
        id={`${slideIndex}-${nodeIndex}`}
        code={node.code}
        fullSize={fullSizeDiagram}
      />
    )
  }
  if (node.type === 'subtitle') {
    return (
      <p className="slide-content-subtitle text-base sm:text-lg font-semibold tracking-wide text-white/95 mb-3 sm:mb-4 m-0">
        {node.content}
      </p>
    )
  }
  if (node.type === 'p') {
    return (
      <p className="slide-content-p mb-2 sm:mb-3 text-base sm:text-[1.05rem] leading-[1.6] m-0 text-white/92">
        {renderInline(node.content)}
      </p>
    )
  }
  if (node.type === 'ul') {
    return (
      <ul className="slide-content-list my-1.5 sm:my-2 mb-3 sm:mb-4 pl-5 sm:pl-6 list-disc m-0 space-y-0.5 sm:space-y-1 [&_li]:leading-relaxed [&_li]:text-white/92 [&_li]:text-base sm:[&_li]:text-[1rem]">
        {node.items.map((inlines, j) => (
          <li key={j}>{renderInline(inlines)}</li>
        ))}
      </ul>
    )
  }
  return null
}
