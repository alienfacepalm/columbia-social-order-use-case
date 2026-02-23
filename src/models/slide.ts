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
  readonly index: number
  /** Speaker timer: seconds to spend on this slide (from Pacing comments or default). */
  readonly durationSeconds: number
}
