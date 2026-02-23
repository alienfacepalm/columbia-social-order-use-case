import { describe, it, expect } from 'vitest'
import { parsePresentation, parseInline } from './parse-presentation'

describe('parseInline', () => {
  it('returns plain text as single text span', () => {
    expect(parseInline('plain')).toEqual([{ type: 'text', value: 'plain' }])
  })

  it('parses bold segments', () => {
    expect(parseInline('**bold**')).toEqual([{ type: 'bold', value: 'bold' }])
    expect(parseInline('before **bold** after')).toEqual([
      { type: 'text', value: 'before ' },
      { type: 'bold', value: 'bold' },
      { type: 'text', value: ' after' },
    ])
  })

  it('parses links', () => {
    expect(parseInline('[click](https://example.com)')).toEqual([
      { type: 'link', value: 'click', href: 'https://example.com' },
    ])
    expect(parseInline('see [here](url) for more')).toEqual([
      { type: 'text', value: 'see ' },
      { type: 'link', value: 'here', href: 'url' },
      { type: 'text', value: ' for more' },
    ])
  })

  it('parses bold and link together', () => {
    const result = parseInline('**bold** and [link](u)')
    expect(result).toEqual([
      { type: 'bold', value: 'bold' },
      { type: 'text', value: ' and ' },
      { type: 'link', value: 'link', href: 'u' },
    ])
  })

  it('returns single text span for empty-looking input', () => {
    expect(parseInline('')).toEqual([{ type: 'text', value: '' }])
  })
})

describe('parsePresentation', () => {
  it('splits slides by ---', () => {
    const raw = `## First
Content one

---
## Second
Content two`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(2)
    expect(slides[0].title).toBe('First')
    expect(slides[0].index).toBe(0)
    expect(slides[1].title).toBe('Second')
    expect(slides[1].index).toBe(1)
  })

  it('strips "Slide N — " style prefix from titles', () => {
    const raw = `## Slide 1 — Introduction
Body

---
## Slide 2 – Next
More`
    const slides = parsePresentation(raw)
    expect(slides[0].title).toBe('Introduction')
    expect(slides[1].title).toBe('Next')
  })

  it('accepts # or ## for title', () => {
    const raw = `# Single Hash Title
Body`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    expect(slides[0].title).toBe('Single Hash Title')
  })

  it('extracts mermaid code blocks and replaces with placeholders', () => {
    const raw = `## With Mermaid
Text before.

\`\`\`mermaid
graph LR
  A --> B
\`\`\`

Text after.`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    const content = slides[0].content
    const mermaidNode = content.find((n) => n.type === 'mermaid')
    expect(mermaidNode).toBeDefined()
    if (mermaidNode && mermaidNode.type === 'mermaid') {
      expect(mermaidNode.code).toContain('graph LR')
      expect(mermaidNode.code).toContain('A --> B')
    }
  })

  it('parses bullet lists', () => {
    const raw = `## List Slide
- One
- Two
- Three`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    const ul = slides[0].content.find((n) => n.type === 'ul')
    expect(ul).toBeDefined()
    if (ul && ul.type === 'ul') {
      expect(ul.items).toHaveLength(3)
    }
  })

  it('strips HTML comments from body', () => {
    const raw = `## Commented
Hello
<!-- comment -->
World`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    const hasComment = slides[0].content.some(
      (n) => n.type === 'p' && n.content.some((s) => s.type === 'text' && s.value.includes('comment'))
    )
    expect(hasComment).toBe(false)
  })

  it('returns empty array for empty or whitespace-only input', () => {
    expect(parsePresentation('')).toEqual([])
    expect(parsePresentation('\n\n---\n\n')).toEqual([])
  })

  it('parses Pacing comment and sets durationSeconds', () => {
    const raw = `## Timed Slide
Content here.
<!-- Pacing: 2 minutes -->`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    expect(slides[0].durationSeconds).toBe(120)
  })

  it('uses upper bound for Pacing range (e.g. 2–3 minutes)', () => {
    const raw = `## Range Slide
Body
<!-- Pacing: 2–3 minutes -->`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    expect(slides[0].durationSeconds).toBe(180)
  })

  it('defaults durationSeconds to 60 when no Pacing comment', () => {
    const raw = `## No Pacing
Body`
    const slides = parsePresentation(raw)
    expect(slides).toHaveLength(1)
    expect(slides[0].durationSeconds).toBe(60)
  })
})
