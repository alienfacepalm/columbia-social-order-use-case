/** Size variant so illustrations vary without breaking layout. All fit in same reserved space. */
export type SlideImageSize = 's' | 'm' | 'l'

/** Per-slide illustration config: path, alt, and size. Position alternates in Slide component. */
export interface SlideImageConfig {
  readonly src: string
  readonly alt: string
  readonly size: SlideImageSize
}

const SLIDE_IMAGES: readonly SlideImageConfig[] = [
  { src: '/slide-images/slide-0.png', alt: 'High-reliability real-time system', size: 'l' },
  { src: '/slide-images/slide-1.png', alt: 'Title slide', size: 'm' },
  { src: '/slide-images/slide-2.png', alt: 'Problem framing: TikTok and commerce', size: 'l' },
  { src: '/slide-images/slide-3.png', alt: 'Requirements and pipeline', size: 's' },
  { src: '/slide-images/slide-4.png', alt: 'Rithum vs direct integration', size: 'm' },
  { src: '/slide-images/slide-5.png', alt: 'Architecture flow', size: 'l' },
  { src: '/slide-images/slide-6.png', alt: 'Downstream order creation', size: 'm' },
  { src: '/slide-images/slide-7.png', alt: 'Upstream status sync', size: 's' },
  { src: '/slide-images/slide-8.png', alt: 'Data provenance and mapping', size: 'm' },
  { src: '/slide-images/slide-9.png', alt: 'Observability and dashboards', size: 'l' },
  { src: '/slide-images/slide-10.png', alt: 'Fault tolerance and reliability', size: 's' },
  { src: '/slide-images/slide-11.png', alt: 'Deployment and canary', size: 'm' },
  { src: '/slide-images/slide-12.png', alt: 'Cross-functional collaboration', size: 'l' },
  { src: '/slide-images/slide-13.png', alt: 'Trade-offs and balance', size: 's' },
  { src: '/slide-images/slide-14.png', alt: 'Impact and success', size: 'm' },
  { src: '/slide-images/slide-15.png', alt: 'Echodyne and system design', size: 'l' },
  { src: '/slide-images/slide-16.png', alt: 'Closing and thank you', size: 'm' },
]

/** Width in px for each size; height scales with object-contain inside fixed container. */
export const IMAGE_SIZE_PX: Record<SlideImageSize, number> = {
  s: 130,
  m: 200,
  l: 260,
} as const

export function getSlideImage(slideIndex: number): SlideImageConfig | null {
  return slideIndex >= 0 && slideIndex < SLIDE_IMAGES.length ? SLIDE_IMAGES[slideIndex] ?? null : null
}

/** Even = right, odd = left */
export function getSlideImagePosition(slideIndex: number): 'left' | 'right' {
  return slideIndex % 2 === 0 ? 'right' : 'left'
}
