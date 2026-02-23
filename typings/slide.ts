/** Inline span: plain text, bold, or link */
export type TInlineSpan =
  | { readonly type: 'text'; value: string }
  | { readonly type: 'bold'; value: string }
  | { readonly type: 'link'; value: string; href: string }

/** Content node for a single slide */
export type TSlideContentNode =
  | { readonly type: 'mermaid'; code: string }
  | { readonly type: 'subtitle'; content: string }
  | { readonly type: 'heading'; level: 2 | 3 | 4; content: string }
  | { readonly type: 'p'; content: readonly TInlineSpan[] }
  | { readonly type: 'ul'; items: readonly TInlineSpan[][] }

export interface ISlide {
  readonly title: string
  readonly content: readonly TSlideContentNode[]
  /** Simplified content for "simple" mode; when set, used when mode is simple. */
  readonly contentSimple?: readonly TSlideContentNode[]
  readonly index: number
  /** Speaker timer: seconds to spend on this slide (from Pacing comments or default). */
  readonly durationSeconds: number
}

export interface ISlideProps {
  readonly slide: ISlide
  readonly slideIndex: number
}

export interface ISlideNodeProps {
  readonly node: TSlideContentNode
  readonly slideIndex: number
  readonly nodeIndex: number
  readonly fullSizeDiagram: boolean
  readonly constrainDiagramHeight: boolean
}

export interface ISlideNavProps {
  readonly slides: readonly ISlide[]
  readonly currentIndex: number
  readonly onPrevious: () => void
  readonly onNext: () => void
  readonly onGoTo: (index: number) => void
  readonly isMobile: boolean
}
