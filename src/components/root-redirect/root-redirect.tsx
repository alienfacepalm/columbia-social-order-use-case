import { useRootRedirect } from '@/hooks/use-root-redirect/use-root-redirect'

/**
 * Redirects from "/" to a clean URL: either from legacy ?mode=#slide- or to /advanced/1.
 */
export function RootRedirect(): null {
  useRootRedirect()
  return null
}
