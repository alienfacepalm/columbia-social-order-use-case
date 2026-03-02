import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { RootRedirect } from './root-redirect'

function renderRootRedirect(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:mode/:slideNum" element={<div>App</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RootRedirect', () => {
  it('renders without throwing when mounted on root path', () => {
    expect(() => renderRootRedirect()).not.toThrow()
  })
})
