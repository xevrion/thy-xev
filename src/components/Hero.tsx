'use client'

import CurrentlyWorking from './CurrentlyWorking'
import SplitText from './reactbits/splittext'
import Socials from './Socials'
import SpotifyWidget from './SpotifyWidget'
import ContestWidget from './ContestWidget'
import WakatimeWidget from './WakatimeWidget'
import WakatimeLanguages from './WakatimeLanguages'
import GithubContributions from './GithubContributions'
import VisitorCount from './VisitorCount'
import Image from 'next/image'
import pfp from '../assets/download (10).jpeg'

export const Hero = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yash Bavadiya',
            alternateName: 'Xevrion',
            url: 'https://xevrion.dev',
            jobTitle: 'Full Stack Developer',
            description: 'Computer Science student from IIT Jodhpur passionate about programming, design, and building creative projects',
            alumniOf: { '@type': 'EducationalOrganization', name: 'IIT Jodhpur' },
            sameAs: [
              'https://github.com/xevrion',
              'https://www.linkedin.com/in/yash-bavadiya-a598a224b/',
              'https://x.com/xevrion_the1',
            ],
            knowsAbout: ['Web Development', 'Full Stack Development', 'React', 'TypeScript', 'Linux', 'Software Engineering'],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Xevrion Portfolio',
            url: 'https://xevrion.dev',
            description: 'Full Stack Developer portfolio showcasing projects, blog posts, and technical expertise',
            author: { '@type': 'Person', name: 'Xevrion' },
          }),
        }}
      />

      <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 w-full">
          <div className="flex flex-col gap-5 text-center md:text-left">
            <SplitText
              text="Hello! I'm"
              className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-battleship-gray sg-bold selection:bg-blue-crayola"
              delay={20}
              duration={1}
              ease="elastic.out(1, 0.5)"
              splitType="words"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <SplitText
              text="Xevrion"
              className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold transition-all duration-150 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff] selection:bg-battleship-gray"
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

          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 border-4 rounded-full border-battleship-gray shrink-0 overflow-hidden">
            <Image src={pfp} alt="profile picture" className="w-full h-full object-cover rounded-full" priority />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <VisitorCount />
          <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start gap-6">
            <SpotifyWidget />
          </div>
          <CurrentlyWorking />
          <ContestWidget />
          <WakatimeWidget />
          <WakatimeLanguages />
          <GithubContributions />
          <div className="flex justify-center">
            <a href="/now" className="text-base sg-regular text-battleship-gray/70 hover:text-soft-royal-blue transition-colors duration-200">
              what i'm doing now →
            </a>
          </div>
          <Socials />
        </div>
      </section>
    </>
  )
}
