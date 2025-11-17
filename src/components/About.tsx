import SplitText from './reactbits/splittext'
import Skills from './Skills'
import Socials from './Socials'
import { Title, Meta, Link } from 'react-head'

export const About = () => {
  return (
    <>
      <Title>About Me | Xevrion - Full Stack Developer</Title>
      <Meta name="title" content="About Me | Xevrion - Full Stack Developer" />
      <Meta name="description" content="Hi! I'm Yash Bavadiya (Xevrion), a Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects that blend functionality and aesthetics." />
      <Link rel="canonical" href="https://xevrion.dev/about" />

      <Meta property="og:type" content="profile" />
      <Meta property="og:url" content="https://xevrion.dev/about" />
      <Meta property="og:title" content="About Xevrion - Full Stack Developer" />
      <Meta property="og:description" content="Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects." />
      <Meta property="og:image" content="https://xevrion.dev/android-chrome-512x512.png" />

      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:url" content="https://xevrion.dev/about" />
      <Meta name="twitter:title" content="About Xevrion - Full Stack Developer" />
      <Meta name="twitter:description" content="Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects." />
      <Meta name="twitter:image" content="https://xevrion.dev/android-chrome-512x512.png" />

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
        <div className='text-center '>
          <h1 className='text-xl sm:text-2xl lg:text-3xl text-soft-royal-blue sg-bold selection:bg-battleship-gray mb-10'>TechStack</h1>
          <Skills />
        </div>
      <div className="mt-10 flex flex-col gap-6 bottom-0">

        <Socials />
      </div>
    </section>
    </>
  )
}

export default About
