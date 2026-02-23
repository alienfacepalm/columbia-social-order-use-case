/**
 * Truncate a string to maxLength and append "..." if truncated.
 */
export function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title
  return title.slice(0, maxLength - 3).trim() + '...'
}
