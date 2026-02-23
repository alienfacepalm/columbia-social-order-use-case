import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export type PresentationMode = 'simple' | 'advanced'

const STORAGE_KEY = 'echodyne-presentation-mode'

function getStoredMode(): PresentationMode {
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
  const { mode: paramMode, slideNum } = useParams<{ mode: string; slideNum?: string }>()
  const navigate = useNavigate()

  const mode: PresentationMode =
    paramMode === 'simple' || paramMode === 'advanced' ? paramMode : getStoredMode()

  const setMode = useCallback(
    (next: PresentationMode) => {
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
