import { describe, it, expect } from 'vitest'

import { assetUrl } from './app'

describe('assetUrl', () => {
  it('normalizes path by stripping leading slash and appends to base', () => {
    // With or without leading slash yields the same result (slash stripped)
    expect(assetUrl('/logo.png')).toBe(assetUrl('logo.png'))
    expect(assetUrl('logo.png')).toMatch(/logo\.png$/)
  })

  it('does not double-slash when path has no leading slash', () => {
    const result = assetUrl('images/slide.png')
    expect(result).toMatch(/\/images\/slide\.png$/)
    expect(result).not.toContain('//')
  })
})

