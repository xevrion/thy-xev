'use client'

import SplitText from './reactbits/splittext'
import Skills from './Skills'
import Socials from './Socials'

export const About = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-12">
      <div className="text-center">
        <SplitText
          text="About Me"
          className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold selection:bg-battleship-gray"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
      </div>

      <div className="text-[var(--color-battleship-gray)]/70 text-base sm:text-[1.0625rem] leading-relaxed max-w-2xl mx-auto text-center sg-regular">
        <p>
          Hi! I'm Yash Bavadiya, a passionate Computer Science student from IIT Jodhpur with a knack for programming, design, and exploring new technologies. I love building creative projects that blend functionality and aesthetics, whether it's web apps, AI tools, or interactive websites. Outside of coding, I enjoy music, playing the piano and ukulele, and constantly learning new skills to push myself forward. My goal is to combine technology and creativity to make meaningful, polished digital experiences.
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-battleship-gray)]/40 uppercase mb-8">Tech Stack</p>
        <Skills />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <Socials />
      </div>
    </section>
  )
}

export default About
