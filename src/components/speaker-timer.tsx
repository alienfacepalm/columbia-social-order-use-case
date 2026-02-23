import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'

import type { ISpeakerTimerProps } from '../../typings/speaker-timer'
import { useSpeakerTimer } from '../hooks/use-speaker-timer'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SpeakerTimer({
  durationSeconds,
  slideIndex,
}: ISpeakerTimerProps): ReactElement {
  const { secondsRemaining, isExpired } = useSpeakerTimer({
    durationSeconds,
    slideIndex,
  })

  const content = (
    <div
      className="fixed bottom-24 left-4 z-[9999] rounded-lg border border-[rgba(102,165,232,0.5)] bg-[rgba(29,51,86,0.95)] px-3 py-2 text-left shadow-lg backdrop-blur sm:bottom-28 sm:left-6"
      aria-live="polite"
      aria-label={isExpired ? 'Time up. Next slide.' : `Time remaining: ${formatTime(secondsRemaining)}`}
    >
      {isExpired ? (
        <p className="text-sm font-semibold text-amber-300 sm:text-base" aria-hidden="true">
          →
        </p>
      ) : (
        <p className="font-mono text-sm tabular-nums text-white/95 sm:text-base">
          {formatTime(secondsRemaining)}
        </p>
      )}
    </div>
  )

  return createPortal(content, document.body)
}
