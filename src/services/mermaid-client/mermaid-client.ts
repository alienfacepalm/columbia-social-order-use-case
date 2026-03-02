import type { IMermaidRenderResult, MermaidInstance } from '@/typings/mermaid'

let mermaidPromise: Promise<MermaidInstance> | null = null

async function loadMermaid(): Promise<MermaidInstance> {
  if (mermaidPromise == null) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = (mod as { default: MermaidInstance }).default

      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        deterministicIds: true,
        themeVariables: {
          primaryColor: '#2d3748',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#4a5568',
          lineColor: '#a0aec0',
          fontSize: '18px',
          edgeLabelBackground: '#2d4a6f',
        },
        flowchart: {
          nodeSpacing: 70,
          rankSpacing: 70,
          wrappingWidth: 180,
        },
      })

      return mermaid
    })
  }
  return mermaidPromise
}

export async function renderMermaidDiagram(id: string, code: string): Promise<IMermaidRenderResult> {
  const mermaid = await loadMermaid()
  const { svg, bindFunctions } = await mermaid.render(id, code)
  return { svg, bindFunctions }
}
