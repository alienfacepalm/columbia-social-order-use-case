import React from 'react'
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { usePresentationRouteRedirect } from './use-presentation-route-redirect'

function wrapper(initialEntry: string) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/:mode/:slideNum?',
          element: children as React.ReactElement,
        }),
      ),
    )
}

describe('usePresentationRouteRedirect', () => {
  it('runs without throwing when mode is valid', () => {
    const { result } = renderHook(() => usePresentationRouteRedirect(), {
      wrapper: wrapper('/simple/1'),
    })
    expect(result.current).toBeUndefined()
  })

  it('runs without throwing when mode is advanced', () => {
    const { result } = renderHook(() => usePresentationRouteRedirect(), {
      wrapper: wrapper('/advanced/2'),
    })
    expect(result.current).toBeUndefined()
  })
})
