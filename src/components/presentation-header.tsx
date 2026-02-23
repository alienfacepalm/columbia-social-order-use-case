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
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[0.65rem] sm:text-xs font-medium text-white/95 backdrop-blur-sm hover:bg-white/20 hover:border-white/35 transition-colors"
          title={isSimple ? 'Switch to advanced (detailed) text' : 'Switch to simple (easier) text'}
          aria-pressed={isSimple}
        >
          <span className={!isSimple ? 'font-semibold text-white' : 'text-white/80'}>Advanced</span>
          <span className="text-white/50">|</span>
          <span className={isSimple ? 'font-semibold text-white' : 'text-white/80'}>Simple</span>
        </button>
        <span className="text-[0.65rem] sm:text-xs font-normal leading-tight text-white/90">
          Prepared for Echodyne Interview by Brandon Pliska
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
