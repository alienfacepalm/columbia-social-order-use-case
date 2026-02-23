/** Size variant so illustrations vary without breaking layout. All fit in same reserved space. */
export type SlideImageSize = 's' | 'm' | 'l'

/** Per-slide illustration config: path, alt, and size. Position alternates in Slide component. */
export interface SlideImageConfig {
  readonly src: string
  readonly alt: string
  readonly size: SlideImageSize
}

const SLIDE_IMAGES: readonly SlideImageConfig[] = [
  { src: '/slide-images/slide-1.png', alt: 'Title slide', size: 'm' },
  { src: '/slide-images/slide-2.png', alt: 'Problem framing: TikTok and commerce', size: 'l' },
  { src: '/slide-images/slide-3.png', alt: 'Requirements and pipeline', size: 's' },
  { src: '/slide-images/slide-4.png', alt: 'Rithum vs direct integration', size: 'm' },
  { src: '/slide-images/slide-5.png', alt: 'Architecture flow', size: 'l' },
  { src: '/slide-images/slide-6.png', alt: 'Azure Function App: Auto-Scaling & Social-Order Adapter', size: 'm' },
  { src: '/slide-images/slide-7.png', alt: 'Downstream order creation', size: 'm' },
  { src: '/slide-images/slide-8.png', alt: 'Upstream status sync', size: 's' },
  { src: '/slide-images/slide-9.png', alt: 'Data provenance and canonical mapping', size: 'm' },
  { src: '/slide-images/slide-10.png', alt: 'Observability: Grafana, Loki, KQL', size: 'l' },
  { src: '/slide-images/slide-11.png', alt: 'Fault tolerance and reliability', size: 's' },
  { src: '/slide-images/slide-12.png', alt: 'Deployment model (Commerce)', size: 'm' },
  { src: '/slide-images/slide-13.png', alt: 'Cross-functional integration', size: 'l' },
  { src: '/slide-images/slide-14.png', alt: 'Key trade-offs', size: 's' },
  { src: '/slide-images/slide-15.png', alt: 'Impact', size: 'm' },
  { src: '/slide-images/slide-16.png', alt: 'Closing / Thank you', size: 'l' },
]

/** Width in px for each size; height scales with object-contain inside fixed container. */
export const IMAGE_SIZE_PX: Record<SlideImageSize, number> = {
  s: 130,
  m: 200,
  l: 260,
} as const

/** Returns image config for slide index 1..16; index 0 (title) has no sidebar image. */
export function getSlideImage(slideIndex: number): SlideImageConfig | null {
  if (slideIndex < 1 || slideIndex >= 1 + SLIDE_IMAGES.length) return null
  return SLIDE_IMAGES[slideIndex - 1] ?? null
}

/** Even = right, odd = left */
export function getSlideImagePosition(slideIndex: number): 'left' | 'right' {
  return slideIndex % 2 === 0 ? 'right' : 'left'
}
