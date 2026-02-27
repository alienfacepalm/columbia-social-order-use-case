import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactElement } from 'react'

import type {
  IMermaidSlideProps,
  IDragState,
  IMermaidDiagramControlsProps,
  IMermaidFullscreenOverlayProps,
} from '@/typings/mermaid'
import { useMermaidRender } from '@/hooks/use-mermaid-render'
import { FullscreenIcon, ZoomInIcon, ZoomOutIcon } from './mermaid-slide-icons'

const ZOOM_MIN = 50
const ZOOM_MAX = 250
const ZOOM_STEP = 25

function MermaidDiagramControls({
  hasSvg,
  zoom,
  setZoom,
  onFullscreen,
}: IMermaidDiagramControlsProps): ReactElement {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1 pb-2">
      <button
        type="button"
        onClick={onFullscreen}
        disabled={!hasSvg}
        className="rounded p-1 border bg-transparent border-white/30 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent inline-flex items-center justify-center"
        aria-label="View diagram fullscreen"
      >
        <FullscreenIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
        disabled={zoom <= ZOOM_MIN}
        className="rounded p-1 border bg-transparent border-white/30 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent inline-flex items-center justify-center"
        aria-label="Zoom out"
      >
        <ZoomOutIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
        disabled={zoom >= ZOOM_MAX}
        className="rounded p-1 border bg-transparent border-white/30 text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent inline-flex items-center justify-center"
        aria-label="Zoom in"
      >
        <ZoomInIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

function MermaidFullscreenOverlay({
  svg,
  diagramSize,
  fullscreenScale,
  fullscreenWrapRef,
  onClose,
}: IMermaidFullscreenOverlayProps): ReactElement {
  return (
    <div
      className="fixed inset-0 z-100 flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Diagram fullscreen"
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-end gap-2 p-3 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-white/70 mr-auto">Diagram — Esc or click outside to close</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close fullscreen"
        >
          Close
        </button>
      </div>
      <div
        className="flex flex-1 min-h-0 min-w-0 items-center justify-center overflow-x-auto overflow-y-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={fullscreenWrapRef}
          className="fullscreen-diagram-wrap inline-flex shrink-0 [&_svg]:block [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
          style={
            diagramSize
              ? {
                  width: diagramSize.width,
                  height: diagramSize.height,
                  minWidth: diagramSize.width,
                  minHeight: diagramSize.height,
                  transform: `scale(${fullscreenScale})`,
                  transformOrigin: 'center center',
                }
              : {
                  width: '90vw',
                  height: '80vh',
                  minWidth: 400,
                  minHeight: 300,
                }
          }
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  )
}

export function MermaidSlide({ code, id, fullSize = false, constrainHeight = false }: IMermaidSlideProps): ReactElement {
  const { result, error, svgRef, diagramSize, setDiagramSize } = useMermaidRender(code)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<IDragState | null>(null)
  const fullscreenWrapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fullscreenScale, setFullscreenScale] = useState(1)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (el && result?.svg != null) {
      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth)
      const maxTop = Math.max(0, el.scrollHeight - el.clientHeight)
      el.scrollLeft = maxLeft / 2
      el.scrollTop = maxTop / 2
    }
  }, [result?.svg, zoom])

  const handlePanMove = useCallback((clientX: number, clientY: number) => {
    const state = dragRef.current
    const el = containerRef.current
    if (!state || !el) return
    const dx = state.startX - clientX
    const dy = state.startY - clientY
    el.scrollLeft = state.startScrollLeft + dx
    el.scrollTop = state.startScrollTop + dy
  }, [])

  const handlePanEnd = useCallback(() => {
    if (dragRef.current) {
      dragRef.current = null
      setIsDragging(false)
    }
  }, [])

  const onContainerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || e.button !== 0) return
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startScrollLeft: containerRef.current.scrollLeft,
        startScrollTop: containerRef.current.scrollTop,
      }
      setIsDragging(true)
    },
    []
  )

  const onContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dragRef.current) handlePanMove(e.clientX, e.clientY)
    },
    [handlePanMove]
  )

  const onContainerTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current || e.changedTouches.length !== 1) return
      const t = e.changedTouches[0]
      dragRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        startScrollLeft: containerRef.current.scrollLeft,
        startScrollTop: containerRef.current.scrollTop,
      }
      setIsDragging(true)
    },
    []
  )

  useLayoutEffect(() => {
    if (!isDragging) return
    const onMouseMove = (e: MouseEvent) => handlePanMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanEnd()
    const onTouchMove = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        e.preventDefault()
        handlePanMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      }
    }
    const onTouchEnd = () => handlePanEnd()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)
    document.addEventListener('touchcancel', onTouchEnd)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [isDragging, handlePanMove, handlePanEnd])

  useEffect(() => {
    if (!isFullscreen) return
    const navKeys = new Set(['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'])
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        return
      }
      if (navKeys.has(e.key)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  // Scale diagram in fullscreen to fit viewport; cap at 2x so it doesn't get too large
  const updateFullscreenScale = useCallback(() => {
    if (!diagramSize || diagramSize.width <= 0 || diagramSize.height <= 0) return
    const padding = 32
    const headerH = 56
    const cw = Math.max(100, window.innerWidth - padding * 2)
    const ch = Math.max(100, window.innerHeight - headerH - padding * 2)
    const fitScale = Math.min(cw / diagramSize.width, ch / diagramSize.height)
    const scale = Math.min(fitScale, 2)
    setFullscreenScale(scale)
  }, [diagramSize])

  useEffect(() => {
    if (!isFullscreen || !diagramSize) {
      setFullscreenScale(1)
      return
    }
    updateFullscreenScale()
    window.addEventListener('resize', updateFullscreenScale)
    return () => window.removeEventListener('resize', updateFullscreenScale)
  }, [isFullscreen, diagramSize, updateFullscreenScale])

  // When fullscreen opens, read SVG size from the overlay if we don't have diagramSize yet (e.g. sequence diagrams)
  useLayoutEffect(() => {
    if (!isFullscreen || diagramSize || !result?.svg) return
    const timer = requestAnimationFrame(() => {
      const wrap = fullscreenWrapRef.current
      const svg = wrap?.querySelector('svg')
      if (!svg) return
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
      if (width > 0 && height > 0) {
        setDiagramSize({ width, height })
      }
    })
    return () => cancelAnimationFrame(timer)
  }, [isFullscreen, diagramSize, result?.svg])

  if (error) {
    return (
      <div className="text-[#f85149] text-sm space-y-1">
        <p className="font-medium">Diagram failed to render.</p>
        <p className="text-xs text-white/80 font-mono break-all">{error}</p>
      </div>
    )
  }

  const diagramContent =
    result?.svg != null ? (
      <div
        ref={svgRef}
        className="inline-flex shrink-0 items-center justify-center [&_svg]:block [&_svg]:min-h-[280px]"
        style={{
          zoom: zoom / 100,
          ...(diagramSize && {
            width: diagramSize.width,
            height: diagramSize.height,
            minWidth: diagramSize.width,
            minHeight: diagramSize.height,
          }),
        }}
        data-mermaid-id={id}
        dangerouslySetInnerHTML={{ __html: result.svg }}
      />
    ) : code.trim() ? (
      <div className="flex min-h-[200px] items-center justify-center text-white/60 text-sm">
        Loading diagram…
      </div>
    ) : (
      <div className="flex min-h-[200px] items-center justify-center text-white/50 text-sm">
        No diagram source.
      </div>
    )

  const controls = (
    <MermaidDiagramControls
      hasSvg={result?.svg != null}
      zoom={zoom}
      setZoom={setZoom}
      onFullscreen={() => setIsFullscreen(true)}
    />
  )

  const diagramContainer = (
    <div
      ref={containerRef}
      className={
        fullSize
          ? 'flex-1 min-h-[320px] overflow-auto select-none cursor-grab active:cursor-grabbing'
          : constrainHeight
            ? 'max-h-[60vh] min-h-[200px] shrink-0 overflow-auto select-none cursor-grab active:cursor-grabbing'
            : 'min-h-[320px] overflow-auto select-none cursor-grab active:cursor-grabbing'
      }
      style={{ userSelect: isDragging ? 'none' : undefined }}
      onMouseDown={onContainerMouseDown}
      onMouseMove={onContainerMouseMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onTouchStart={onContainerTouchStart}
    >
      {diagramContent}
    </div>
  )

  const fullscreenOverlay =
    isFullscreen && result?.svg != null && typeof document !== 'undefined' && document.body != null
      ? createPortal(
          <MermaidFullscreenOverlay
            svg={result.svg}
            diagramSize={diagramSize}
            fullscreenScale={fullscreenScale}
            fullscreenWrapRef={fullscreenWrapRef}
            onClose={() => setIsFullscreen(false)}
          />,
          document.body
        )
      : null

  if (fullSize) {
    return (
      <div className="flex flex-1 min-h-0 min-w-0 flex-col">
        {controls}
        {diagramContainer}
        {fullscreenOverlay}
      </div>
    )
  }

  return (
    <div className="my-4 flex shrink-0 flex-col min-h-0">
      {controls}
      {diagramContainer}
      {fullscreenOverlay}
    </div>
  )
}
