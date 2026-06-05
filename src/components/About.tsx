'use client'

import Skills from './Skills'

export const About = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10 border-t border-battleship-gray/15">
      <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase">About</p>

      <div className="text-[var(--color-text)] text-base sm:text-[1.0625rem] leading-relaxed max-w-2xl sg-regular">
        <p>
          Hi! I'm Yash Bavadiya, a Computer Science student from IIT Jodhpur with a knack for programming, design, and exploring new technologies. I love building creative projects that blend functionality and aesthetics — web apps, AI tools, interactive websites. Outside of coding, I enjoy music, playing the piano and ukulele, and constantly learning new things. My goal is to combine technology and creativity to make meaningful, polished digital experiences.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase">Tech Stack</p>
        <Skills />
      </div>
    </section>
  )
}

export default About
