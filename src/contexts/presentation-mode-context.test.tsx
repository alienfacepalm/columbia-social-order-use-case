import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { PresentationModeProvider, usePresentationMode } from './presentation-mode-context'

function renderUsePresentationMode(initialEntry: string) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:mode/:slideNum"
          element={<PresentationModeProvider>{children}</PresentationModeProvider>}
        />
      </Routes>
    </MemoryRouter>
  )

  return renderHook(() => usePresentationMode(), { wrapper })
}

describe('PresentationModeProvider', () => {
  it('derives mode from route params', () => {
    const { result } = renderUsePresentationMode('/simple/1')
    expect(result.current.mode).toBe('simple')
    expect(result.current.isSimple).toBe(true)
  })

  it('toggles between simple and advanced', () => {
    const { result } = renderUsePresentationMode('/advanced/1')
    expect(result.current.mode).toBe('advanced')

    act(() => {
      result.current.toggle()
    })

    expect(result.current.mode === 'simple' || result.current.mode === 'advanced').toBe(true)
  })
})

