import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type PresentationMode = 'simple' | 'advanced'

const URL_PARAM = 'mode'
const STORAGE_KEY = 'echodyne-presentation-mode'

function getModeFromUrl(): PresentationMode | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const value = params.get(URL_PARAM)
  if (value === 'simple' || value === 'advanced') return value
  return null
}

function loadInitialMode(): PresentationMode {
  if (typeof window === 'undefined') return 'advanced'
  const fromUrl = getModeFromUrl()
  if (fromUrl !== null) return fromUrl
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'simple' || stored === 'advanced') return stored
  } catch {
    // ignore
  }
  return 'advanced'
}

function updateUrlMode(mode: PresentationMode): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set(URL_PARAM, mode)
  window.history.replaceState(null, '', url.toString())
}

interface IPresentationModeContextValue {
  mode: PresentationMode
  setMode: (mode: PresentationMode) => void
  toggle: () => void
  isSimple: boolean
}

const PresentationModeContext = createContext<IPresentationModeContextValue | null>(null)

export function usePresentationMode(): IPresentationModeContextValue {
  const value = useContext(PresentationModeContext)
  if (value === null) {
    throw new Error('usePresentationMode must be used within PresentationModeProvider')
  }
  return value
}

interface IPresentationModeProviderProps {
  children: ReactNode
}

export function PresentationModeProvider({ children }: IPresentationModeProviderProps): ReactNode {
  const [mode, setModeState] = useState<PresentationMode>(loadInitialMode)

  const setMode = useCallback((next: PresentationMode) => {
    setModeState(next)
    updateUrlMode(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const onPopState = (): void => {
      const fromUrl = getModeFromUrl()
      setModeState(fromUrl ?? 'advanced')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const toggle = useCallback(() => {
    setMode(mode === 'simple' ? 'advanced' : 'simple')
  }, [mode, setMode])

  const value = useMemo<IPresentationModeContextValue>(
    () => ({
      mode,
      setMode,
      toggle,
      isSimple: mode === 'simple',
    }),
    [mode, setMode, toggle],
  )

  return (
    <PresentationModeContext.Provider value={value}>
      {children}
    </PresentationModeContext.Provider>
  )
}
