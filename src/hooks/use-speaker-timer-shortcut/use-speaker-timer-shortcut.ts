import { useEffect, useState } from 'react'

/**
 * Manages speaker timer visibility and registers Shift+T to toggle it.
 * Returns [isVisible, setVisible] for use in the UI.
 */
export function useSpeakerTimerShortcut(): readonly [
  boolean,
  (value: boolean | ((prev: boolean) => boolean)) => void,
] {
  const [isTimerVisible, setIsTimerVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.shiftKey && (event.key === 't' || event.key === 'T')) {
        event.preventDefault()
        setIsTimerVisible((visible) => !visible)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return [isTimerVisible, setIsTimerVisible] as const
}
