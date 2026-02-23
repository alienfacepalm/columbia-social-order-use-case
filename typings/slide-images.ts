export type TSlideImageSize = 's' | 'm' | 'l'

export interface ISlideImageConfig {
  readonly src: string
  readonly alt: string
  readonly size: TSlideImageSize
}
