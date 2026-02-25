import type { ReactElement } from 'react'

import { assetUrl } from '../config/app'
import { usePresentationMode } from '../contexts/presentation-mode-context'

export function PresentationHeader(): ReactElement {
  const { toggle, isSimple } = usePresentationMode()

  return (
    <div className="flex flex-shrink-0 flex-col items-center sm:flex-row sm:items-center sm:justify-between w-full gap-2 py-2 pt-3 sm:py-3 sm:pt-4">
      <div className="flex flex-col items-center gap-0.5 sm:items-start sm:gap-1">
        <img
          src={assetUrl('columbia.png')}
          alt="Columbia Sportswear"
          className="block h-12 w-auto sm:h-14 md:h-[6.67rem] m-0 sm:ml-4 md:ml-[70px] align-middle brightness-0 invert"
          width={320}
          height={68}
        />
        <span className="text-[0.7rem] sm:text-[0.8rem] font-medium uppercase tracking-[0.1em] leading-tight text-white/95 text-center sm:text-left">
          Social-Order Adapter Use Case
        </span>
      </div>
      <div className="flex flex-col items-center gap-1.5 sm:items-end sm:gap-1 text-center sm:text-right">
        <button
          type="button"
          role="switch"
          onClick={toggle}
          className="relative flex h-8 w-[7.5rem] sm:h-9 sm:w-[8.5rem] rounded-full border border-white/25 bg-white/10 p-1 sm:p-1.5 backdrop-blur-sm hover:bg-white/15 hover:border-white/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          title={isSimple ? 'Switch to advanced (detailed) text' : 'Switch to simple (easier) text'}
          aria-checked={!isSimple}
          aria-label="Presentation mode: Advanced or Simple"
        >
          <span
            className="absolute top-1 bottom-1 sm:top-1.5 sm:bottom-1.5 w-[calc(50%-2px)] rounded-full bg-white/90 shadow-md transition-all duration-200 ease-out"
            style={{ left: isSimple ? 'calc(50% + 2px)' : '4px' }}
          />
          <span
            className={`relative z-10 flex flex-1 items-center justify-center text-[0.65rem] sm:text-xs font-medium transition-colors ${!isSimple ? 'text-[#1d3356] font-semibold' : 'text-white/70'}`}
          >
            Advanced
          </span>
          <span
            className={`relative z-10 flex flex-1 items-center justify-center text-[0.65rem] sm:text-xs font-medium transition-colors ${isSimple ? 'text-[#1d3356] font-semibold' : 'text-white/70'}`}
          >
            Simple
          </span>
        </button>
        <span className="text-[0.65rem] sm:text-xs font-normal leading-tight text-white/90">
          Columbia Sportswear — Social-Order Adapter by Brandon Pliska
        </span>
        <a
          href="https://github.com/alienfacepalm/columbia-social-order-use-case"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.65rem] sm:text-xs font-normal leading-tight text-[#66a5e8] hover:text-[#99c4f0] underline break-all"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
