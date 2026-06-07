import { BannerParticles } from './BannerParticles'

function CornerMark({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-10 size-4 flex items-center justify-center ${className}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="stroke-battleship-gray/25">
        <line x1="5" y1="0" x2="5" y2="10" strokeWidth="1" />
        <line x1="0" y1="5" x2="10" y2="5" strokeWidth="1" />
      </svg>
    </span>
  )
}

export const HeroBanner = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 sm:pt-14">
      <div className="relative">
        <CornerMark className="-top-2 -left-2" />
        <CornerMark className="-top-2 -right-2" />
        <CornerMark className="-bottom-2 -left-2" />
        <CornerMark className="-bottom-2 -right-2" />

        <div className="relative w-full h-40 sm:h-56 lg:h-72 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner-dark.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover hidden dark:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner-light.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover block dark:hidden"
          />

          <BannerParticles />

          {/* Edge fades */}
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-[5] bg-gradient-to-t from-[var(--color-taupe)]/90 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-r from-[var(--color-taupe)]/90 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-l from-[var(--color-taupe)]/90 to-transparent" />
        </div>
      </div>
    </div>
  )
}
