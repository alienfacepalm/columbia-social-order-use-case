import type { TInlineSpan, ISlide, TSlideContentNode, IUlItem } from '../models/slide'

/**
 * Parses presentation markdown (e.g. presentation/advanced.md) into slide objects.
 * Splits by ---, extracts ## title and body, and pulls out mermaid code blocks.
 */
export function parsePresentation(raw: string): ISlide[] {
  const slides: ISlide[] = []
  const blocks = raw.split(/\n---\n/).map((b) => b.trim()).filter(Boolean)

  const pacingRegex = /<!--\s*Pacing:\s*(\d+)(?:[–-](\d+))?\s*(?:minute|min)s?\s*-->/i

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const lines = block.split('\n')

    let durationSeconds = 60
    const pacingMatch = block.match(pacingRegex)
    if (pacingMatch) {
      const low = parseInt(pacingMatch[1], 10)
      const high = pacingMatch[2] ? parseInt(pacingMatch[2], 10) : low
      const minutes = Math.max(low, high)
      durationSeconds = minutes * 60
    }

    let title = ''
    let bodyStart = 0
    // Skip leading comments and blank lines to find # or ## title
    let lineIndex = 0
    while (lineIndex < lines.length) {
      const line = lines[lineIndex]
      const trimmed = line.trim()
      if (trimmed.startsWith('<!--') || trimmed === '') {
        lineIndex++
        continue
      }
      if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
        title = trimmed.replace(/^#+\s*/, '').trim()
        // Remove "Slide N — " / "Slide N – " / "Slide N - " prefix from titles
        title = title.replace(/^Slide \d+\s*[—–\-]\s*/i, '').trim()
        bodyStart = lineIndex + 1
        break
      }
      break
    }

    const bodyLines = lines.slice(bodyStart)
    let bodyRaw = bodyLines.join('\n')
    // Remove full HTML comment blocks so they are not shown on slides
    bodyRaw = bodyRaw.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n').trim()

    const mermaidRegex = /```\s*mermaid\s*[\r\n]+([\s\S]*?)```/g
    const mermaidCharts: string[] = []
    const body = bodyRaw.replace(mermaidRegex, (_, code: string) => {
      const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
      mermaidCharts.push(normalized)
      return `\n{{MERMAID:${mermaidCharts.length - 1}}}\n`
    })

    const content = parseBody(body, mermaidCharts)
    slides.push({ title, content, index: i, durationSeconds })
  }

  return slides
}

/**
 * Merges advanced slides with simple-version slides by index.
 * Each advanced slide gets contentSimple from the corresponding simple slide when available.
 */
export function mergePresentationWithSimple(
  advanced: ISlide[],
  simple: ISlide[],
): ISlide[] {
  return advanced.map((slide, i) => {
    const simpleSlide = simple[i]
    const contentSimple = simpleSlide ? simpleSlide.content : undefined
    return contentSimple ? { ...slide, contentSimple } : slide
  })
}

function parseBody(body: string, mermaidCharts: readonly string[]): TSlideContentNode[] {
  const nodes: TSlideContentNode[] = []
  const parts = body.split(/(\{\{MERMAID:\d+\}\})/g)

  for (const part of parts) {
    const mermaidMatch = part.match(/^\{\{MERMAID:(\d+)\}\}$/)
    if (mermaidMatch) {
      const idx = parseInt(mermaidMatch[1], 10)
      nodes.push({ type: 'mermaid', code: mermaidCharts[idx] })
      continue
    }
    if (!part.trim()) continue

    const lines = part.split('\n')
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      if (line.trim().startsWith('<!--')) {
        i++
        continue
      }
      if (line.startsWith('#### ')) {
        nodes.push({ type: 'heading', level: 4, content: line.replace(/^####\s*/, '').trim() })
        i++
        continue
      }
      if (line.startsWith('### ')) {
        nodes.push({ type: 'heading', level: 3, content: line.replace(/^###\s*/, '').trim() })
        i++
        continue
      }
      if (line.startsWith('## ')) {
        nodes.push({ type: 'heading', level: 2, content: line.replace(/^##\s*/, '').trim() })
        i++
        continue
      }
      const listMatch = line.match(/^(\s*)-\s(.*)$/)
      if (listMatch) {
        const baseIndent = listMatch[1].length
        const items: IUlItem[] = []
        let current: IUlItem | null = null
        const children: TInlineSpan[][] = []
        while (i < lines.length) {
          const nextMatch = lines[i].match(/^(\s*)-\s(.*)$/)
          if (!nextMatch) break
          const indent = nextMatch[1].length
          const content = parseInline(nextMatch[2].trim())
          if (indent <= baseIndent) {
            if (current) {
              items.push(children.length > 0 ? { ...current, children: [...children] } : current)
              children.length = 0
            }
            current = { content }
          } else {
            children.push(content)
          }
          i++
        }
        if (current) {
          items.push(children.length > 0 ? { ...current, children: [...children] } : current)
        }
        nodes.push({ type: 'ul', items })
        continue
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        nodes.push({ type: 'p', content: parseInline(line) })
        i++
        continue
      }
      if (line.trim()) {
        const text = line.trim().replace(/^#+\s*/, '')
        nodes.push({ type: 'p', content: parseInline(text) })
      }
      i++
    }
  }
  return nodes
}

/** Parse a segment that may contain [text](url) links (no **) */
function parseLinkSegment(segment: string): TInlineSpan[] {
  const out: TInlineSpan[] = []
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = linkRegex.exec(segment)) !== null) {
    if (m.index > lastIndex) {
      out.push({ type: 'text', value: segment.slice(lastIndex, m.index) })
    }
    out.push({ type: 'link', value: m[1], href: m[2] })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < segment.length) {
    out.push({ type: 'text', value: segment.slice(lastIndex) })
  }
  return out
}

/** Inline: **bold**, [link](url), and plain text */
export function parseInline(text: string): TInlineSpan[] {
  const out: TInlineSpan[] = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push(...parseLinkSegment(text.slice(lastIndex, m.index)))
    }
    out.push({ type: 'bold', value: m[1] })
    lastIndex = m.index + m[0].length
  }
  out.push(...parseLinkSegment(text.slice(lastIndex)))
  return out.length > 0 ? out : [{ type: 'text', value: text }]
}
