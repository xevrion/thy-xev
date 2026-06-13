'use client'

import Socials from './Socials'
import Image from 'next/image'
import pfp from '../assets/download (10).jpeg'
import { Mark } from './Mark'
import { LocationTag } from './LocationTag'
import { Mail, FileText, ArrowRight } from 'lucide-react'

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
            CS student at <Mark>IIT Jodhpur</Mark>. I build things for the web, tinker with systems, and <Mark>occasionally touch grass</Mark>.
          </p>

          <div className="flex flex-col items-center md:items-start gap-3 mt-1">
            {/* Fused button group */}
            <div className="group inline-flex items-stretch rounded-full border border-battleship-gray/30 overflow-hidden transition-colors duration-300 hover:border-battleship-gray/50">
              <a
                href="#contact"
                className="flex items-center gap-2.5 pl-5 pr-2 py-2.5 bg-soft-royal-blue text-white sg-semibold text-sm transition-[filter] duration-300 hover:brightness-110 active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5 opacity-80" />
                Get in touch
                <span className="ml-1 flex items-center justify-center w-5 h-5 rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </a>
              <div className="w-px bg-battleship-gray/20" />
              <a
                href="/resume"
                className="flex items-center gap-2 px-5 py-2.5 text-[var(--color-text)] sg-regular text-sm transition-colors duration-200 hover:text-soft-royal-blue"
              >
                <FileText className="w-3.5 h-3.5 opacity-60" />
                Resume
              </a>
            </div>
          </div>
        </div>

        <div className="shrink-0 p-1.5 rounded-[1.75rem] bg-battleship-gray/[0.06] ring-1 ring-battleship-gray/10">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-[1.4rem] overflow-hidden ring-1 ring-inset ring-white/10">
            <Image src={pfp} alt="profile picture" className="w-full h-full object-cover" priority />
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center md:justify-start">
        <Socials />
      </div>
    </section>
  )
}
