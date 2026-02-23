import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#2d3748',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4a5568',
    lineColor: '#a0aec0',
    fontSize: '18px',
  },
  flowchart: {
    nodeSpacing: 70,
    rankSpacing: 70,
    wrappingWidth: 180,
  },
})

export interface MermaidSlideProps {
  readonly code: string
  readonly id: string
  /** When true, diagram fills available space (diagram-only slide). */
  readonly fullSize?: boolean
}

const DIAGRAM_ZOOM_OPTIONS = [100, 125, 150, 200] as const

export function MermaidSlide({ code, id, fullSize = false }: MermaidSlideProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const uniqueId = useId()
  const mermaidId = `mermaid-${uniqueId.replace(/:/g, '-')}`
  const [zoom, setZoom] = useState<number>(125)
  const [result, setResult] = useState<{
    svg: string
    bindFunctions: ((element: Element) => void) | undefined
  } | null>(null)
  const [error, setError] = useState<boolean>(false)

  useLayoutEffect(() => {
    if (!code?.trim()) return
    setError(false)
    setResult(null)
    let cancelled = false

    mermaid
      .render(mermaidId, code.trim())
      .then(({ svg, bindFunctions }) => {
        if (cancelled) return
        setResult({ svg, bindFunctions })
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Mermaid render failed:', err)
          setError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, mermaidId])

  useLayoutEffect(() => {
    if (result?.bindFunctions && ref.current) {
      result.bindFunctions(ref.current)
    }
  }, [result])

  if (error) {
    return (
      <div className="text-[#f85149] text-sm">
        Diagram failed to render.
      </div>
    )
  }

  if (fullSize) {
    return (
      <div className="flex flex-1 min-h-0 min-w-0 flex-col">
        <div className="flex flex-shrink-0 justify-end gap-1 pb-2">
          <span className="text-xs text-white/70 mr-1">Zoom:</span>
          {DIAGRAM_ZOOM_OPTIONS.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setZoom(pct)}
              className={`min-w-[2.25rem] rounded px-1.5 py-0.5 text-xs border ${
                zoom === pct
                  ? 'bg-white/20 border-white/50 text-white'
                  : 'bg-transparent border-white/30 text-white/80 hover:bg-white/10'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center">
          <div
            ref={ref}
            className="flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:h-auto [&_svg]:w-auto"
            style={{ zoom: zoom / 100 }}
            data-mermaid-id={id}
            dangerouslySetInnerHTML={result?.svg ? { __html: result.svg } : undefined}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="my-4 flex min-h-[200px] items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      data-mermaid-id={id}
      dangerouslySetInnerHTML={result?.svg ? { __html: result.svg } : undefined}
    />
  )
}
