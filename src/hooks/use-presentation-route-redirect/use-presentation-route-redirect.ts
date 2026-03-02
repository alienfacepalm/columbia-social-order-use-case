import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

/**
 * Redirects to /simple/{slideNum} when the URL mode is not "simple" or "advanced".
 * Call this once in the app shell (e.g. App) so invalid modes are corrected.
 */
export function usePresentationRouteRedirect(): void {
  const { mode, slideNum } = useParams<{ mode: string; slideNum?: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'simple' || mode === 'advanced') return
    navigate(`/simple/${slideNum ?? '1'}`, { replace: true })
  }, [mode, slideNum, navigate])
}
