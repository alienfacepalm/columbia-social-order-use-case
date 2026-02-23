import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type PresentationMode = 'simple' | 'advanced'

const STORAGE_KEY = 'echodyne-presentation-mode'

function loadStoredMode(): PresentationMode {
  if (typeof window === 'undefined') return 'advanced'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'simple' || stored === 'advanced') return stored
  } catch {
    // ignore
  }
  return 'advanced'
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
  const [mode, setModeState] = useState<PresentationMode>(loadStoredMode)

  const setMode = useCallback((next: PresentationMode) => {
    setModeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
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
