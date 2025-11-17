import SplitText from './reactbits/splittext'
import data from '../../constants/projects.json'
import { Helmet } from 'react-helmet-async'
import Socials from './Socials';

const { projects, pastProjects } = data;

export const Projects = () => {
  return (
    <>
      <Helmet>
        <title>Projects | Xevrion - Full Stack Developer</title>
        <meta name="title" content="Projects | Xevrion - Full Stack Developer" />
        <meta name="description" content="Explore my current and past projects including web applications, AI tools, and interactive websites. Showcasing creative projects that blend functionality and aesthetics." />
        <link rel="canonical" href="https://xevrion.dev/projects" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xevrion.dev/projects" />
        <meta property="og:title" content="Projects | Xevrion" />
        <meta property="og:description" content="Explore my current and past projects including web applications, AI tools, and interactive websites." />
        <meta property="og:image" content="https://xevrion.dev/android-chrome-512x512.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://xevrion.dev/projects" />
        <meta name="twitter:title" content="Projects | Xevrion" />
        <meta name="twitter:description" content="Explore my current and past projects including web applications, AI tools, and interactive websites." />
        <meta name="twitter:image" content="https://xevrion.dev/android-chrome-512x512.png" />
      </Helmet>

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-16  ">

      {/* Heading */}
      <div className="text-center">
        <SplitText
          text="Projects"
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

      {/* Currently Working */}

      <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl">
        <div className="inter-bold">Currently Working</div>
        {projects.map((value) => {
          return (<>
            <div className="flex whitespace-nowrap gap-1">
              <a href={value['url']} className="hover:underline inter-medium text-xl " target="_blank">{value['text']}</a>
              <p className="inter-medium text-xl truncate">- {value['desc']}</p>
            </div>
          </>
          )
        })}

      </div>

      {/* Past Projects */}
      <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl">
        <div className="inter-bold">Past Projects</div>
        {pastProjects.map((value) => {
          return (<>
            <div className="flex whitespace-nowrap gap-1">
              <a href={value['url']} className="hover:underline inter-medium text-xl " target="_blank">{value['text']}</a>
              <p className="inter-medium text-xl truncate">- {value['desc']}</p>
            </div>
          </>
          )
        })}

      </div>


      <div className="mt-10 flex flex-col gap-6 bottom-0">

        <Socials />
      </div>

    </section>
    </>
  )
}
