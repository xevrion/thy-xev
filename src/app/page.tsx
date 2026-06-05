import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Projects } from '@/components/Projects'
import { Now } from '@/components/Now'
import { BlogTeaser } from '@/components/BlogTeaser'
import { Contact } from '@/components/Contact'
import { SectionDivider } from '@/components/SectionDivider'

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
      <BlogTeaser />
      <SectionDivider />
      <div id="contact"><Contact /></div>
    </>
  )
}
