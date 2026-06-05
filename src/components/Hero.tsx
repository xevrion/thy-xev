'use client'

import Socials from './Socials'
import Image from 'next/image'
import pfp from '../assets/download (10).jpeg'

export const Hero = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 w-full">
        <div className="flex flex-col gap-5 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text)] sg-bold leading-tight">
              Yash Bavadiya
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
              Full Stack Developer
            </p>
          </div>

          <p className="text-[var(--color-text-muted)] sg-regular text-base sm:text-lg max-w-md">
            CS student at IIT Jodhpur. I build things for the web, tinker with systems, and occasionally touch grass.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-1 justify-center md:justify-start">
            <a
              href="#contact"
              className="px-5 py-2.5 bg-soft-royal-blue text-white sg-semibold text-sm hover:opacity-90 transition-opacity duration-200 text-center"
            >
              Get in touch
            </a>
            <a
              href="/resume"
              className="px-5 py-2.5 border border-battleship-gray/40 text-[var(--color-text)] sg-regular text-sm hover:border-soft-royal-blue hover:text-soft-royal-blue transition-colors duration-200 text-center"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 border border-battleship-gray/30 shrink-0 overflow-hidden">
          <Image src={pfp} alt="profile picture" className="w-full h-full object-cover" priority />
        </div>
      </div>

      <div className="mt-12 flex justify-center md:justify-start">
        <Socials />
      </div>
    </section>
  )
}
