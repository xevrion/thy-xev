import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
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
      <Hero />
      <SectionDivider />
      <div id="about"><About /></div>
      <SectionDivider />
      <div id="projects"><Projects /></div>
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
