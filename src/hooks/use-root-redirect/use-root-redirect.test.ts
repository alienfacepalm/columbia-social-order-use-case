import React from 'react'
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { useRootRedirect } from './use-root-redirect'

function wrapper(initialEntry: string) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/', element: children as React.ReactElement }),
        React.createElement(Route, { path: '/:mode/:slideNum', element: null }),
      ),
    )
}

describe('useRootRedirect', () => {
  it('runs without throwing on root path', () => {
    const { result } = renderHook(() => useRootRedirect(), {
      wrapper: wrapper('/'),
    })
    expect(result.current).toBeUndefined()
  })
})
