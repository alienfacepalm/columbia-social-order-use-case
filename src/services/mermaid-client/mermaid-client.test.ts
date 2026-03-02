import { describe, expect, it, vi } from 'vitest'

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({
      svg: '<svg xmlns="http://www.w3.org/2000/svg"/>',
      bindFunctions: undefined,
    }),
  },
}))

import { renderMermaidDiagram } from './mermaid-client'

describe('renderMermaidDiagram', () => {
  it('returns svg and bindFunctions from mermaid.render', async () => {
    const result = await renderMermaidDiagram('diagram-1', 'graph TD\nA-->B')
    expect(result).toEqual({
      svg: expect.any(String),
      bindFunctions: undefined,
    })
    expect(result.svg).toContain('svg')
  })
})
