/** Size variant so illustrations vary without breaking layout. All fit in same reserved space. */
export type SlideImageSize = 's' | 'm' | 'l'

/** Per-slide illustration config: path, alt, and size. Position alternates in Slide component. */
export interface SlideImageConfig {
  readonly src: string
  readonly alt: string
  readonly size: SlideImageSize
}

/** Only non-diagram slides get an image. Order matches slide indices: 1, 3, 12, 13, 15, 16. */
const SLIDE_IMAGES: readonly SlideImageConfig[] = [
  { src: '/slide-images/slide-1.png', alt: 'Welcome', size: 'm' },
  { src: '/slide-images/slide-3.png', alt: 'Requirements and pipeline', size: 's' },
  { src: '/slide-images/slide-12.png', alt: 'Deployment model (Commerce)', size: 'm' },
  { src: '/slide-images/slide-13.png', alt: 'Cross-functional integration', size: 'l' },
  { src: '/slide-images/slide-15.png', alt: 'Impact', size: 'm' },
  { src: '/slide-images/slide-16.png', alt: 'Closing / Thank you', size: 'l' },
]

/** Slide indices that display a sidebar image (non-diagram slides only). */
const SLIDE_INDICES_WITH_IMAGE: readonly number[] = [1, 3, 12, 13, 15, 16]

/** Width in px for each size; height scales with object-contain inside fixed container. */
export const IMAGE_SIZE_PX: Record<SlideImageSize, number> = {
  s: 130,
  m: 200,
  l: 260,
} as const

/** Returns image config for non-diagram slides; index 0 (title) and any slide with a diagram get no image. */
export function getSlideImage(slideIndex: number, hasDiagram?: boolean): SlideImageConfig | null {
  if (slideIndex < 1 || hasDiagram) return null
  const idx = SLIDE_INDICES_WITH_IMAGE.indexOf(slideIndex)
  if (idx === -1) return null
  return SLIDE_IMAGES[idx] ?? null
}

/** Even = right, odd = left */
export function getSlideImagePosition(slideIndex: number): 'left' | 'right' {
  return slideIndex % 2 === 0 ? 'right' : 'left'
}
