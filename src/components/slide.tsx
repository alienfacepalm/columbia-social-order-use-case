import type { ReactElement } from 'react'
import type { InlineSpan, Slide as SlideModel, SlideContentNode } from '../models/slide'
import { MermaidSlide } from './mermaid-slide'
import { parseInline } from '../utils/parse-presentation'

function renderInline(inlines: readonly InlineSpan[]): ReactElement[] {
  return inlines.map((span, j) =>
    span.type === 'bold' ? (
      <strong key={j}>{span.value}</strong>
    ) : (
      <span key={j}>{span.value}</span>
    )
  )
}

export interface SlideProps {
  readonly slide: SlideModel
  readonly slideIndex: number
}

export function Slide({ slide, slideIndex }: SlideProps): ReactElement {
  return (
    <section className="slide">
      {slide.title && (
        <h2 className="slide-title">
          {renderInline(parseInline(slide.title))}
        </h2>
      )}
      <div className="slide-body">
        {slide.content.map((node, i) => (
          <SlideNode
            key={i}
            node={node}
            slideIndex={slideIndex}
            nodeIndex={i}
          />
        ))}
      </div>
    </section>
  )
}

interface SlideNodeProps {
  readonly node: SlideContentNode
  readonly slideIndex: number
  readonly nodeIndex: number
}

function SlideNode({ node, slideIndex, nodeIndex }: SlideNodeProps): ReactElement | null {
  if (node.type === 'mermaid') {
    return (
      <MermaidSlide
        id={`${slideIndex}-${nodeIndex}`}
        code={node.code}
      />
    )
  }
  if (node.type === 'subtitle') {
    return <p className="slide-subtitle">{node.content}</p>
  }
  if (node.type === 'p') {
    return <p className="slide-p">{renderInline(node.content)}</p>
  }
  if (node.type === 'ul') {
    return (
      <ul className="slide-ul">
        {node.items.map((inlines, j) => (
          <li key={j}>{renderInline(inlines)}</li>
        ))}
      </ul>
    )
  }
  return null
}
