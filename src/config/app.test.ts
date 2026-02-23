import { describe, it, expect } from 'vitest'
import { assetUrl } from './app'

describe('assetUrl', () => {
  it('normalizes path by stripping leading slash and appends to base', () => {
    // With default base '/' we get /path
    expect(assetUrl('/logo.png')).toBe('/logo.png')
    expect(assetUrl('logo.png')).toBe('/logo.png')
  })

  it('does not double-slash when path has no leading slash', () => {
    expect(assetUrl('images/slide.png')).toBe('/images/slide.png')
  })
})
