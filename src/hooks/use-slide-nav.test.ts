import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { renderHook, act } from '@testing-library/react'

import { useSlideNav } from './use-slide-nav'

function renderUseSlideNav(initialEntry: string, total: number) {
  const navigateMock = vi.fn()
  window.history.pushState({}, '', initialEntry)

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MemoryRouter,
      { initialEntries: [initialEntry] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/:mode/:slideNum',
          element: children as React.ReactElement,
        }),
      ),
    )

  const { result } = renderHook(() => useSlideNav({ total }), { wrapper })
  return { result, navigateMock }
}

describe('useSlideNav', () => {
  it('parses slide index from URL and clamps within range', () => {
    const { result } = renderUseSlideNav('/advanced/100', 5)
    expect(result.current.index).toBe(4)
  })

  it('go moves forward and backward within bounds', () => {
    const { result } = renderUseSlideNav('/advanced/2', 5)

    act(() => {
      result.current.go(1)
    })
    expect(result.current.index).toBeGreaterThanOrEqual(0)

    act(() => {
      result.current.go(-10)
    })
    expect(result.current.index).toBeGreaterThanOrEqual(0)
  })

  it('goTo navigates to exact slide index within bounds', () => {
    const { result } = renderUseSlideNav('/advanced/1', 5)

    act(() => {
      result.current.goTo(3)
    })
    expect(result.current.index).toBeLessThan(5)
  })
})

