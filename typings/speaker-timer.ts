export interface IUseSpeakerTimerOptions {
  /** Total seconds for the current slide. */
  readonly durationSeconds: number
  /** Current slide index; changing this resets the timer. */
  readonly slideIndex: number
}

export interface IUseSpeakerTimerReturn {
  /** Seconds left (0 when expired). */
  readonly secondsRemaining: number
  /** True when countdown has reached 0. */
  readonly isExpired: boolean
}

export interface ISpeakerTimerProps {
  readonly durationSeconds: number
  readonly slideIndex: number
}
