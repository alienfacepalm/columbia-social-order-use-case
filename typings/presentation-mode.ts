import type { ReactNode } from 'react'

export type TPresentationMode = 'simple' | 'advanced'

export interface IPresentationModeContextValue {
  readonly mode: TPresentationMode
  readonly setMode: (mode: TPresentationMode) => void
  readonly toggle: () => void
  readonly isSimple: boolean
}

export interface IPresentationModeProviderProps {
  readonly children: ReactNode
}
