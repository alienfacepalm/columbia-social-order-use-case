import type { ISlideImageConfig, TSlideImageSize } from '../../typings/slide-images'

/** Only non-diagram slides get an image. Order matches slide indices: 1, 3, 12, 13, 15, 16. */
const SLIDE_IMAGES: readonly ISlideImageConfig[] = [
  { src: '/slide-images/slide-1.png', alt: 'Presentation structure', size: 'm' },
  { src: '/slide-images/slide-3.png', alt: 'Requirements and pipeline', size: 's' },
  { src: '/slide-images/slide-12.png', alt: 'Deployment model', size: 'm' },
  { src: '/slide-images/slide-13.png', alt: 'QA and testing', size: 'l' },
  { src: '/slide-images/slide-15.png', alt: 'Cross-functional integration', size: 'm' },
  { src: '/slide-images/slide-16.png', alt: 'Team leadership and delivery', size: 'l' },
]

/** Slide indices that display a sidebar image (non-diagram slides only). */
const SLIDE_INDICES_WITH_IMAGE: readonly number[] = [1, 3, 12, 13, 15, 16]

/** Width in px for each size; height scales with object-contain inside fixed container. */
export const IMAGE_SIZE_PX: Readonly<Record<TSlideImageSize, number>> = {
  s: 130,
  m: 200,
  l: 260,
} as const

/** Returns image config for non-diagram slides; index 0 (title) and any slide with a diagram get no image. */
export function getSlideImage(slideIndex: number, hasDiagram?: boolean): ISlideImageConfig | null {
  if (slideIndex < 1 || hasDiagram) return null
  const idx = SLIDE_INDICES_WITH_IMAGE.indexOf(slideIndex)
  if (idx === -1) return null
  return SLIDE_IMAGES[idx] ?? null
}

/** Even = right, odd = left. */
export function getSlideImagePosition(slideIndex: number): 'left' | 'right' {
  return slideIndex % 2 === 0 ? 'right' : 'left'
}
