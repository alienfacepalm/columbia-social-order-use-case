import type { ReactElement } from 'react'

import type { ISlide } from '../models/slide'
import { assetUrl } from '../config/app'
import { getSlideImage, getSlideImagePosition, IMAGE_SIZE_PX } from '../config/slide-images'
import { SlideNode } from './slide-node'
import { parseInline } from '../utils/parse-presentation'
import { renderInline } from '../utils/render-inline'

export interface ISlideProps {
  readonly slide: ISlide
  readonly slideIndex: number
}

function hasDiagram(slide: ISlide): boolean {
  return slide.content.some((node) => node.type === 'mermaid')
}

/** Use full-size diagram only when slide has no list (diagram-only or diagram + short text). */
function getFullSizeDiagram(slide: ISlide): boolean {
  return hasDiagram(slide) && !slide.content.some((node) => node.type === 'ul')
}

export function Slide({ slide, slideIndex }: ISlideProps): ReactElement {
  const isDiagramSlide = hasDiagram(slide)
  const imageConfig = getSlideImage(slideIndex, isDiagramSlide)
  const imagePosition = getSlideImagePosition(slideIndex)
  const fullSizeDiagram = getFullSizeDiagram(slide)
  const isTitleSlide = slideIndex === 0

  if (isTitleSlide) {
    const headingNodes = slide.content.filter((n): n is typeof n & { type: 'heading' } => n.type === 'heading')
    return (
      <section className="relative flex flex-1 w-full min-h-0 overflow-hidden px-4 sm:px-8 py-6 sm:py-12 rounded-xl flex-col sm:flex-row items-center sm:items-center justify-center gap-6 sm:gap-10 md:gap-12 max-w-6xl">
        <div className="relative z-10 flex flex-shrink-0 flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-[1.5_1_0%] sm:min-w-[min(55%,28rem)]">
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
          src={assetUrl('title.png')}
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
        <div className="flex justify-center mb-2 flex-shrink-0">
          <h2 className="slide-section-title text-sm sm:text-base font-semibold leading-tight text-white/95 m-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
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
              src={assetUrl(imageConfig.src)}
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
