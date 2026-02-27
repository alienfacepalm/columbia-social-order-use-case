import { useState, useEffect } from 'react'

import type {
  IUseSpeakerTimerOptions,
  IUseSpeakerTimerReturn,
} from '@/typings/speaker-timer'

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
