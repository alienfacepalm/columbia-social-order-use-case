export interface IUseSlideNavOptions {
  readonly total: number
}

export interface IUseSlideNavReturn {
  readonly index: number
  readonly go: (delta: number) => void
  readonly goTo: (slideIndex: number) => void
  readonly goToStart: () => void
  readonly goToEnd: () => void
}
