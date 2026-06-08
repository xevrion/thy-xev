'use client'

import Skills from './Skills'
import { SectionLabel } from './SectionLabel'
import { Mark } from './Mark'

export const About = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>About</SectionLabel>

      <div className="text-[var(--color-text)] text-base sm:text-[1.0625rem] leading-relaxed max-w-2xl sg-regular">
        <p>
          Hi! I&apos;m Yash Bavadiya, a <Mark>Computer Science student from IIT Jodhpur</Mark> with a knack for programming, design, and exploring new technologies. I love building creative projects that blend functionality and aesthetics, like <Mark>web apps, AI tools, interactive websites</Mark>. Outside of coding, I enjoy music, playing the piano and ukulele, and <Mark>constantly learning new things</Mark>. My goal is to combine technology and creativity to make <Mark>meaningful, polished digital experiences</Mark>.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>Tech Stack</SectionLabel>
        <Skills />
      </div>
    </section>
  )
}

export default About
