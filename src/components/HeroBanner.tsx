import { BannerParticles } from './BannerParticles'
import { SectionDivider } from './SectionDivider'

export const HeroBanner = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative">
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
      <SectionDivider />
    </div>
  )
}
