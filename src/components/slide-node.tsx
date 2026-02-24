import type { ReactElement } from 'react'

import type { ISlideNodeProps } from '../../typings/slide'
import type { TSlideContentNode } from '../models/slide'
import { renderInline } from '../utils/render-inline'
import { MermaidSlide } from './mermaid-slide'

export function SlideNode({
  node,
  slideIndex,
  nodeIndex,
  fullSizeDiagram,
  constrainDiagramHeight,
}: ISlideNodeProps): ReactElement | null {
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
      <ul className="slide-content-list my-1.5 sm:my-2 mb-3 sm:mb-4 pl-5 sm:pl-6 list-disc m-0 space-y-0.5 sm:space-y-1 [&_li]:leading-relaxed [&_li]:text-white/92 [&_li]:text-base sm:[&_li]:text-[1rem] [&_ul]:pl-5 [&_ul]:sm:pl-6 [&_ul]:mt-0.5 [&_ul]:list-disc">
        {node.items.map((item, j) => (
          <li key={j}>
            {renderInline(item.content)}
            {item.children && item.children.length > 0 ? (
              <ul className="slide-content-list-nested mt-0.5 pl-5 sm:pl-6 list-disc space-y-0.5 sm:space-y-1 [&_li]:leading-relaxed [&_li]:text-white/92 [&_li]:text-base sm:[&_li]:text-[1rem]">
                {item.children.map((inlines, k) => (
                  <li key={k}>{renderInline(inlines)}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    )
  }
  return null
}
