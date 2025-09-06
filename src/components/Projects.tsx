import SplitText from './reactbits/splittext'
import data from '../../constants/projects.json'
import SpotifyWidget from './SpotifyWidget';
import ActivityWidget from './ActivityStatus';
import CurrentlyWorking from './CurrentlyWorking';
import Socials from './Socials';

const { projects, pastProjects } = data;

export const Projects = () => {
  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-16 ">

      {/* Heading */}
      <div className="text-center">
        <SplitText
          text="Projects"
          className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-battleship-gray sg-bold selection:bg-battleship-gray"
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
  )
}
