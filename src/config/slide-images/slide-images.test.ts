import { describe, expect, it } from 'vitest'

import {
  getSlideImage,
  getSlideImagePosition,
  IMAGE_SIZE_PX,
} from './slide-images'

describe('getSlideImage', () => {
  it('returns null for slide index 0 (title slide)', () => {
    expect(getSlideImage(0, false)).toBeNull()
  })

  it('returns null when hasDiagram is true', () => {
    expect(getSlideImage(1, true)).toBeNull()
  })

  it('returns config for known slide indices 1, 3, 12, 13, 15, 16', () => {
    expect(getSlideImage(1, false)).toMatchObject({
      src: '/slide-images/slide-1.png',
      alt: 'Presentation structure',
      size: 'm',
    })
    expect(getSlideImage(3, false)).toMatchObject({ alt: 'Requirements and pipeline' })
  })

  it('returns null for slide index not in the image list', () => {
    expect(getSlideImage(2, false)).toBeNull()
    expect(getSlideImage(10, false)).toBeNull()
  })
})

describe('getSlideImagePosition', () => {
  it('returns left for odd slide indices', () => {
    expect(getSlideImagePosition(1)).toBe('left')
    expect(getSlideImagePosition(3)).toBe('left')
  })

  it('returns right for even slide indices', () => {
    expect(getSlideImagePosition(2)).toBe('right')
    expect(getSlideImagePosition(4)).toBe('right')
  })
})

describe('IMAGE_SIZE_PX', () => {
  it('defines sizes s, m, l', () => {
    expect(IMAGE_SIZE_PX.s).toBe(130)
    expect(IMAGE_SIZE_PX.m).toBe(200)
    expect(IMAGE_SIZE_PX.l).toBe(260)
  })
})
