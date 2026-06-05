'use client'

import SplitText from './reactbits/splittext'
import data from '../../constants/projects.json'
import Socials from './Socials'
import { LinkPreview } from './LinkPreview'

const { projects, pastProjects } = data

export const Projects = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-16">
      <div className="text-center">
        <SplitText
          text="Projects"
          className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold selection:bg-battleship-gray leading-tight"
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

      <div className="text-[var(--color-text)] flex flex-col gap-1 sm:gap-0 text-xl">
        <div className="inter-bold">Currently Working</div>
        {projects.map((value, index) => (
          <div key={index} className="flex whitespace-nowrap gap-2 items-center">
            {value.image ? (
              <LinkPreview url={value.url} isStatic imageSrc={value.image} className="hover:underline inter-medium text-xl">
                {value.text}
              </LinkPreview>
            ) : (
              <LinkPreview url={value.url} className="hover:underline inter-medium text-xl">
                {value.text}
              </LinkPreview>
            )}
            {value.live && (
              <a href={value.live} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 border border-battleship-gray/30 rounded hover:bg-battleship-gray/10 transition-colors inter-medium">
                live
              </a>
            )}
            <p className="inter-medium text-xl truncate">- {value.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-[var(--color-text)] flex flex-col gap-1 sm:gap-0 text-xl">
        <div className="inter-bold">Past Projects</div>
        {pastProjects.map((value, index) => (
          <div key={index} className="flex whitespace-nowrap gap-2 items-center">
            {value.image ? (
              <LinkPreview url={value.url} isStatic imageSrc={value.image} className="hover:underline inter-medium text-xl">
                {value.text}
              </LinkPreview>
            ) : (
              <LinkPreview url={value.url} className="hover:underline inter-medium text-xl">
                {value.text}
              </LinkPreview>
            )}
            {value.live && (
              <a href={value.live} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 border border-battleship-gray/30 rounded hover:bg-battleship-gray/10 transition-colors inter-medium">
                live
              </a>
            )}
            <p className="inter-medium text-xl truncate">- {value.desc}</p>
          </div>
        ))}
      </div>

      <Socials />
    </section>
  )
}
