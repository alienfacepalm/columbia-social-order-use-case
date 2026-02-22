import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2d3748',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4a5568',
    lineColor: '#a0aec0',
  },
})

export interface MermaidSlideProps {
  readonly code: string
  readonly id: string
}

export function MermaidSlide({ code, id }: MermaidSlideProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    if (!code?.trim() || !ref.current) return
    setError(null)
    const el = ref.current
    const mermaidId = `mermaid-slide-${id.replace(/\s+/g, '-')}`
    let cancelled = false

    mermaid
      .render(mermaidId, code.trim())
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !el) return
        el.innerHTML = svg
        bindFunctions?.(el)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [code, id])

  if (error) {
    return <div className="mermaid-error">Diagram failed to render.</div>
  }

  return <div ref={ref} className="mermaid-wrap" data-mermaid-id={id} />
}
