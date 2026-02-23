import type { Dispatch, SetStateAction } from 'react'
import { useLayoutEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

import type { IDiagramSize, IMermaidRenderResult, IUseMermaidRenderReturn } from '../../typings/mermaid'

const renderIdRef = { current: 0 }

function measureSvgFromRef(svgRef: React.RefObject<HTMLDivElement>): IDiagramSize | null {
  const svg = svgRef.current?.querySelector('svg')
  if (!svg) return null
  const w = svg.getAttribute('width')
  const h = svg.getAttribute('height')
  const viewBox = svg.getAttribute('viewBox')
  let width = 0
  let height = 0
  if (w != null && h != null) {
    width = parseFloat(w) || 0
    height = parseFloat(h) || 0
  }
  if ((width === 0 || height === 0) && viewBox) {
    const parts = viewBox.trim().split(/\s+/)
    if (parts.length >= 4) {
      width = width || parseFloat(parts[2]) || 0
      height = height || parseFloat(parts[3]) || 0
    }
  }
  return width > 0 && height > 0 ? { width, height } : null
}

export function useMermaidRender(code: string): IUseMermaidRenderReturn {
  const svgRef = useRef<HTMLDivElement>(null)
  const uniqueId = useId()
  const [result, setResult] = useState<IMermaidRenderResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [diagramSize, setDiagramSize] = useState<IDiagramSize | null>(null)

  useLayoutEffect(() => {
    if (!code?.trim()) return
    setError(null)
    setResult(null)
    setDiagramSize(null)
    let cancelled = false
    const mermaidId = `mermaid-${uniqueId.replace(/:/g, '-')}-${++renderIdRef.current}`

    mermaid
      .render(mermaidId, code.trim())
      .then(({ svg, bindFunctions }) => {
        if (cancelled) return
        setResult({ svg, bindFunctions })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err)
          console.error('Mermaid render failed:', err)
          setError(message)
        }
      })

    return () => {
      cancelled = true
    }
  }, [code, uniqueId])

  useLayoutEffect(() => {
    if (!result?.bindFunctions || !svgRef.current) return
    result.bindFunctions(svgRef.current)
    const size = measureSvgFromRef(svgRef)
    if (size) setDiagramSize(size)
  }, [result])

  return { result, error, svgRef, diagramSize, setDiagramSize }
}
