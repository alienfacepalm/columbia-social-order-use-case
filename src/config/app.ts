/** App-wide constants for presentation UI. */

export const MOBILE_TITLE_MAX_LENGTH = 24
export const SWIPE_THRESHOLD_PX = 50

const BASE = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
  ? import.meta.env.BASE_URL
  : '/'

/**
 * Resolve a public asset path with the app base URL (for Vite/static deploy).
 */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '')
  return `${BASE}${normalized}`
}
