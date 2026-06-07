import { Hero } from '@/components/Hero'
import { HeroBanner } from '@/components/HeroBanner'
import { About } from '@/components/About'
import { Experience } from '@/components/Experience'
import { Projects } from '@/components/Projects'
import { Now } from '@/components/Now'
import { BlogTeaser } from '@/components/BlogTeaser'
import { Contact } from '@/components/Contact'
import { Quote } from '@/components/Quote'
import { SectionDivider } from '@/components/SectionDivider'
import { Uses } from '@/components/Uses'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Hero />
      <SectionDivider />
      <div id="about"><About /></div>
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <div id="projects"><Projects limit={6} showViewAll flat /></div>
      <SectionDivider />
      <div id="now"><Now /></div>
      <SectionDivider />
      <Uses />
      <SectionDivider />
      <BlogTeaser />
      <SectionDivider />
      <Quote />
      <SectionDivider />
      <div id="contact"><Contact /></div>
    </>
  )
}
