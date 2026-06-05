'use client'

import data from '../../constants/projects.json'
import { LinkPreview } from './LinkPreview'

const { projects, pastProjects } = data

export const Projects = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10 border-t border-battleship-gray/15">
      <p className="text-xs font-mono font-medium tracking-widest text-[var(--color-text-muted)]/60 uppercase">Projects</p>

      <div className="text-[var(--color-text)] flex flex-col gap-1 sm:gap-0 text-xl">
        <div className="inter-bold mb-2">Currently Working</div>
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
        <div className="inter-bold mb-2">Past Projects</div>
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

    </section>
  )
}
