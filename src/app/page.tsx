import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Projects } from '@/components/Projects'
import { Now } from '@/components/Now'
import { BlogTeaser } from '@/components/BlogTeaser'
import { Contact } from '@/components/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <div id="about"><About /></div>
      <div id="projects"><Projects /></div>
      <div id="now"><Now /></div>
      <BlogTeaser />
      <div id="contact"><Contact /></div>
    </>
  )
}
