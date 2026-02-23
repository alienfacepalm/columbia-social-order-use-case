export interface IUseSwipeNavigationOptions {
  readonly onSwipeLeft: () => void
  readonly onSwipeRight: () => void
}

export interface IUseSwipeNavigationReturn {
  readonly onTouchStart: (e: React.TouchEvent) => void
  readonly onTouchEnd: (e: React.TouchEvent) => void
}
