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
  const isDiagramSlide = hasDiagram(slide)
  const imageConfig = getSlideImage(slideIndex, isDiagramSlide)
  const imagePosition = getSlideImagePosition(slideIndex)
  const fullSizeDiagram = useFullSizeDiagram(slide)
  const isTitleSlide = slideIndex === 0

  if (isTitleSlide) {
    const headingNodes = slide.content.filter((n): n is typeof n & { type: 'heading' } => n.type === 'heading')
    return (
      <section className="relative flex flex-1 w-full min-h-0 overflow-hidden px-4 sm:px-8 py-6 sm:py-12 rounded-xl flex-col sm:flex-row items-center sm:items-center justify-center gap-6 sm:gap-10 md:gap-12 max-w-5xl">
        <div className="relative z-10 flex flex-shrink-0 flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
          <h1 className="slide-title-h1 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-white m-0 mb-2 sm:mb-3">
            {slide.title}
          </h1>
          {headingNodes.map((node, i) => {
            if (node.level === 2) {
              return (
                <h2 key={i} className="slide-title-h2 text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-white/95 m-0 mb-1 sm:mb-2">
                  {node.content}
                </h2>
              )
            }
            if (node.level === 3) {
              return (
                <h3 key={i} className="slide-title-h3 text-base sm:text-lg md:text-xl font-medium tracking-wide text-white/90 m-0 mb-2 sm:mb-3">
                  {node.content}
                </h3>
              )
            }
            return (
              <h4
                key={i}
                className="slide-title-byline text-xs sm:text-sm md:text-base font-normal tracking-wide text-white m-0 mt-2 sm:mt-3 mb-4 sm:mb-6"
              >
                {node.content}
              </h4>
            )
          })}
        </div>
        <img
          src="/title.png"
          alt="Presentation title"
          className="relative z-0 block flex-shrink-0 object-contain w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] max-h-[40vh] sm:max-h-[65vh]"
        />
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
            ? fullSizeDiagram
              ? 'flex-1 min-h-0 flex flex-col min-w-0'
              : 'flex-none flex flex-col min-w-0'
            : `flex w-full gap-4 sm:gap-6 items-start flex-1 min-h-0 min-w-0 flex-col md:flex-row ${imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`
        }
      >
        <div
          className={
            isDiagramSlide
              ? fullSizeDiagram
                ? 'flex-1 min-h-0 flex flex-col min-w-0 gap-3'
                : 'flex-none flex flex-col min-w-0 gap-3'
              : 'flex-1 min-w-0'
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
              constrainDiagramHeight={isDiagramSlide && !fullSizeDiagram}
            />
          ))}
        </div>
        {imageConfig && (
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
  readonly constrainDiagramHeight: boolean
}

function SlideNode({ node, slideIndex, nodeIndex, fullSizeDiagram, constrainDiagramHeight }: SlideNodeProps): ReactElement | null {
  if (node.type === 'mermaid') {
    return (
      <MermaidSlide
        id={`${slideIndex}-${nodeIndex}`}
        code={node.code}
        fullSize={fullSizeDiagram}
        constrainHeight={constrainDiagramHeight}
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
  if (node.type === 'heading') {
    const content = node.content
    if (node.level === 2) {
      return (
        <h2 className="slide-content-h2 text-lg sm:text-xl font-semibold tracking-wide text-white/95 mb-2 sm:mb-3 m-0">
          {content}
        </h2>
      )
    }
    if (node.level === 3) {
      return (
        <h3 className="slide-content-h3 text-base sm:text-lg font-semibold tracking-wide text-white/95 mb-3 sm:mb-4 m-0">
          {content}
        </h3>
      )
    }
    return (
      <h4 className="slide-content-h4 text-sm sm:text-base font-medium tracking-wide text-white/90 mb-2 sm:mb-3 m-0">
        {content}
      </h4>
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
