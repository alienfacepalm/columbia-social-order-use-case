import { createContext, useCallback, useContext, useMemo, type ReactElement } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import type {
  TPresentationMode,
  IPresentationModeContextValue,
  IPresentationModeProviderProps,
} from '../../../typings/presentation-mode'

const STORAGE_KEY = 'columbia-presentation-mode'

function getStoredMode(): TPresentationMode {
  if (typeof window === 'undefined') return 'simple'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'simple' || stored === 'advanced') return stored
  } catch {
    // ignore
  }
  return 'simple'
}

const PresentationModeContext = createContext<IPresentationModeContextValue | null>(null)

export function usePresentationMode(): IPresentationModeContextValue {
  const value = useContext(PresentationModeContext)
  if (value === null) {
    throw new Error('usePresentationMode must be used within PresentationModeProvider')
  }
  return value
}

export function PresentationModeProvider({
  children,
}: IPresentationModeProviderProps): ReactElement {
  const { mode: paramMode, slideNum } = useParams<{ mode: string; slideNum?: string }>()
  const navigate = useNavigate()

  const mode: TPresentationMode =
    paramMode === 'simple' || paramMode === 'advanced' ? paramMode : getStoredMode()

  const setMode = useCallback(
    (next: TPresentationMode) => {
      const slide = slideNum ?? '1'
      navigate(`/${next}/${slide}`, { replace: true })
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
    },
    [navigate, slideNum],
  )

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

