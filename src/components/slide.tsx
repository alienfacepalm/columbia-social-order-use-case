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

export function Slide({ slide, slideIndex }: SlideProps): ReactElement {
  const imageConfig = getSlideImage(slideIndex)
  const imagePosition = getSlideImagePosition(slideIndex)
  const isDiagramSlide = hasDiagram(slide)
  const isTitleSlide = slideIndex === 0

  if (isTitleSlide) {
    const [main, sub, byline] = slide.content
    const mainText = main?.type === 'p' ? renderInline(main.content) : null
    const subText = sub?.type === 'p' ? renderInline(sub.content) : null
    const bylineText = byline?.type === 'p' ? renderInline(byline.content) : null
    return (
      <section className="flex flex-1 w-full min-h-0 overflow-auto mt-8 px-8 py-12 bg-black/25 border border-white/20 rounded-xl flex-col items-center justify-center text-center max-w-4xl">
        <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-white mb-4 m-0 tracking-tight">
          {mainText}
        </h1>
        <p className="text-xl text-white/95 mb-6 m-0">
          {subText}
        </p>
        <p className="text-base text-white/80 m-0 font-medium">
          {bylineText}
        </p>
      </section>
    )
  }

  return (
    <section
      className={`flex flex-1 w-full min-h-0 overflow-auto mt-8 px-8 py-7 bg-black/20 border border-white/15 rounded-lg flex-col ${isDiagramSlide ? 'max-w-6xl' : 'max-w-4xl'}`}
    >
      {slide.title && (
        <div className="flex justify-end mb-2 flex-shrink-0">
          <h2 className="text-sm font-semibold leading-tight text-white/90 m-0">
            {renderInline(parseInline(slide.title))}
          </h2>
        </div>
      )}
      <div
        className={
          isDiagramSlide
            ? 'flex-1 min-h-0 flex flex-col min-w-0'
            : `flex w-full gap-6 items-start flex-1 min-h-0 min-w-0 ${imagePosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`
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
            />
          ))}
        </div>
        {!isDiagramSlide && imageConfig && (
          <div className="slide-illustration-wrap flex-shrink-0 w-[280px] h-[200px] flex items-center justify-center p-3">
            <img
              src={imageConfig.src}
              alt={imageConfig.alt}
              className={`slide-illustration object-contain object-center w-auto h-auto max-h-[176px] ${
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
}

function SlideNode({ node, slideIndex, nodeIndex, isDiagramSlide }: SlideNodeProps): ReactElement | null {
  if (node.type === 'mermaid') {
    return (
      <MermaidSlide
        id={`${slideIndex}-${nodeIndex}`}
        code={node.code}
        fullSize={isDiagramSlide}
      />
    )
  }
  if (node.type === 'subtitle') {
    return (
      <p className="text-lg opacity-90 mb-4 m-0">{node.content}</p>
    )
  }
  if (node.type === 'p') {
    return (
      <p className="mb-3 text-[1.05rem] leading-[1.55] m-0">
        {renderInline(node.content)}
      </p>
    )
  }
  if (node.type === 'ul') {
    return (
      <ul className="my-2 mb-4 pl-6 list-disc m-0 [&_li]:my-[0.35rem] [&_li]:leading-normal">
        {node.items.map((inlines, j) => (
          <li key={j}>{renderInline(inlines)}</li>
        ))}
      </ul>
    )
  }
  return null
}
