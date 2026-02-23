import type { Dispatch, SetStateAction } from 'react'

export interface IMermaidSlideProps {
  readonly code: string
  readonly id: string
  readonly fullSize?: boolean
  readonly constrainHeight?: boolean
}

export interface IDragState {
  readonly startX: number
  readonly startY: number
  readonly startScrollLeft: number
  readonly startScrollTop: number
}

export interface IMermaidDiagramControlsProps {
  readonly hasSvg: boolean
  readonly zoom: number
  readonly setZoom: (fn: (z: number) => number) => void
  readonly onFullscreen: () => void
}

export interface IDiagramSize {
  readonly width: number
  readonly height: number
}

export interface IMermaidFullscreenOverlayProps {
  readonly svg: string
  readonly diagramSize: IDiagramSize | null
  readonly fullscreenScale: number
  readonly fullscreenWrapRef: React.RefObject<HTMLDivElement>
  readonly onClose: () => void
}

export interface IMermaidRenderResult {
  readonly svg: string
  readonly bindFunctions: ((element: Element) => void) | undefined
}

export interface IUseMermaidRenderReturn {
  readonly result: IMermaidRenderResult | null
  readonly error: string | null
  readonly svgRef: React.RefObject<HTMLDivElement>
  readonly diagramSize: IDiagramSize | null
  readonly setDiagramSize: Dispatch<SetStateAction<IDiagramSize | null>>
}
