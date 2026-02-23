import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Redirects from "/" to a clean URL: either from legacy ?mode=#slide- or to /advanced/1.
 */
export function RootRedirect(): null {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const params = new URLSearchParams(location.search)
    const modeParam = params.get('mode')
    const hash = location.hash
    const slideMatch = hash.match(/^#slide-(\d+)$/)

    const mode =
      modeParam === 'simple' || modeParam === 'advanced' ? modeParam : 'advanced'
    const slideNum = slideMatch ? slideMatch[1] : '1'

    navigate(`/${mode}/${slideNum}`, { replace: true })
  }, [location.pathname, location.search, location.hash, navigate])

  return null
}
