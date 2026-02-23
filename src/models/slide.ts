/** Inline span: plain text, bold, or link */
export type InlineSpan =
  | { readonly type: 'text'; value: string }
  | { readonly type: 'bold'; value: string }
  | { readonly type: 'link'; value: string; href: string }

/** Content node for a single slide */
export type SlideContentNode =
  | { readonly type: 'mermaid'; code: string }
  | { readonly type: 'subtitle'; content: string }
  | { readonly type: 'p'; content: readonly InlineSpan[] }
  | { readonly type: 'ul'; items: readonly InlineSpan[][] }

export interface Slide {
  readonly title: string
  readonly content: readonly SlideContentNode[]
  readonly index: number
}
