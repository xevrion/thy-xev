'use client'

import Socials from './Socials'
import Image from 'next/image'
import pfp from '../assets/download (10).jpeg'
import { Mark } from './Mark'
import { LocationTag } from './LocationTag'
import { Mail, FileText } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 sm:py-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 w-full">
        <div className="flex flex-col gap-5 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text)] sg-bold leading-tight">
              Yash Bavadiya
            </h1>
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] sg-regular">
                Full Stack Developer
              </p>
              <LocationTag />
            </div>
          </div>

          <p className="text-[var(--color-text-muted)] sg-regular text-base sm:text-lg max-w-md">
            CS student at <Mark>IIT Jodhpur</Mark>. I build things for the web, <Mark>tinker with systems</Mark>, and occasionally touch grass.
          </p>

          <div className="flex flex-col items-center md:items-start gap-3 mt-1">
            {/* Fused button group */}
            <div className="inline-flex items-stretch rounded-full border border-battleship-gray/30 overflow-hidden">
              <a
                href="#contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-soft-royal-blue text-white sg-semibold text-sm hover:opacity-90 transition-opacity duration-200"
              >
                <Mail className="w-3.5 h-3.5 opacity-80" />
                Get in touch
              </a>
              <div className="w-px bg-battleship-gray/20" />
              <a
                href="/resume"
                className="flex items-center gap-2 px-5 py-2.5 text-[var(--color-text)] sg-regular text-sm hover:text-soft-royal-blue transition-colors duration-200"
              >
                <FileText className="w-3.5 h-3.5 opacity-60" />
                Resume
              </a>
            </div>
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
