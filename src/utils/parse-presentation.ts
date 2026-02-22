import type { InlineSpan, Slide, SlideContentNode } from '../models/slide'

/**
 * Parses presentation.md content into slide objects.
 * Splits by ---, extracts ## title and body, and pulls out mermaid code blocks.
 */
export function parsePresentation(raw: string): Slide[] {
  const slides: Slide[] = []
  const blocks = raw.split(/\n---\n/).map((b) => b.trim()).filter(Boolean)

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const lines = block.split('\n')

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
    slides.push({ title, content, index: i })
  }

  return slides
}

function parseBody(body: string, mermaidCharts: readonly string[]): SlideContentNode[] {
  const nodes: SlideContentNode[] = []
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
      if (line.startsWith('### ')) {
        nodes.push({ type: 'subtitle', content: line.replace(/^#+\s*/, '').trim() })
        i++
        continue
      }
      if (line.startsWith('- ')) {
        const items: InlineSpan[][] = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(parseInline(lines[i].slice(2)))
          i++
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

/** Inline: **bold** and plain text */
export function parseInline(text: string): InlineSpan[] {
  const out: InlineSpan[] = []
  const boldRegex = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push({ type: 'text', value: text.slice(lastIndex, m.index) })
    }
    out.push({ type: 'bold', value: m[1] })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) {
    out.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return out.length > 0 ? out : [{ type: 'text', value: text }]
}
