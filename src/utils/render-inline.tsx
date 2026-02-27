import type { ReactElement } from 'react'

import type { TInlineSpan } from '@/models/slide'
import { parseInline } from '@/utils/parse-presentation/parse-presentation'

/**
 * Renders inline spans (text, bold, links) to React elements.
 * Guards against pathological nesting by limiting bold recursion depth.
 */
function renderInlineInternal(inlines: readonly TInlineSpan[], depth: number): ReactElement[] {
  if (depth > 4) {
    return inlines.map((span, j) => (
      <span key={j}>{span.value}</span>
    ))
  }

  return inlines.map((span, j) => {
    if (span.type === 'bold') {
      return (
        <strong key={j}>
          {renderInlineInternal(parseInline(span.value), depth + 1)}
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

export function renderInline(inlines: readonly TInlineSpan[]): ReactElement[] {
  return renderInlineInternal(inlines, 0)
}
