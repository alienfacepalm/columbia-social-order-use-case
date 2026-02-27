import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { PresentationModeProvider } from '@/contexts/presentation-mode-context/presentation-mode-context'
import { PresentationHeader } from './presentation-header'

function renderWithProviders(initialEntry = '/simple/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:mode/:slideNum"
          element={
            <PresentationModeProvider>
              <PresentationHeader />
            </PresentationModeProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PresentationHeader', () => {
  it('renders the Columbia logo with correct alt text', () => {
    renderWithProviders()
    expect(screen.getByAltText('Columbia Sportswear')).toBeTruthy()
  })

  it('renders the mode toggle with Advanced and Simple labels', () => {
    renderWithProviders()
    expect(screen.getByRole('switch', { name: /presentation mode/i })).toBeTruthy()
    expect(screen.getByText('Advanced')).toBeTruthy()
    expect(screen.getByText('Simple')).toBeTruthy()
  })
})
