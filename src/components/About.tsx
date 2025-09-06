import SplitText from './reactbits/splittext'

export const About = () => {
  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-12">
      
      {/* Heading */}
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

      {/* Paragraph */}
      <div className="text-battleship-gray text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto text-center">
        <p>
          Hi! I'm Yash Bavadiya, a passionate Computer Science student from IIT Jodhpur with a knack for programming, design, and exploring new technologies. I love building creative projects that blend functionality and aesthetics, whether it's web apps, AI tools, or interactive websites. Outside of coding, I enjoy music, playing the piano and ukulele, and constantly learning new skills to push myself forward. My goal is to combine technology and creativity to make meaningful, polished digital experiences.
        </p>
      </div>

    </section>
  )
}

export default About
