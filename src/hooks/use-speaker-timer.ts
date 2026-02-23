import { useState, useEffect } from 'react'

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

export function useSpeakerTimer({
  durationSeconds,
  slideIndex,
}: IUseSpeakerTimerOptions): IUseSpeakerTimerReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds)

  // Reset to full duration whenever slide or duration changes
  useEffect(() => {
    setSecondsRemaining(durationSeconds)
  }, [durationSeconds, slideIndex])

  useEffect(() => {
    if (secondsRemaining <= 0) return
    const id = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [secondsRemaining])

  return {
    secondsRemaining,
    isExpired: secondsRemaining <= 0,
  }
}
