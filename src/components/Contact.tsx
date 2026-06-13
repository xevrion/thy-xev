'use client'

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Mail, ArrowUpRight } from 'lucide-react'
import { SectionLabel } from './SectionLabel'
import { Mark } from './Mark'

const contacts = [
  { icon: <Mail className="w-5 h-5" />,        text: 'me@xevrion.dev',                 url: 'mailto:me@xevrion.dev' },
  { icon: <FaGithub className="w-5 h-5" />,    text: 'github.com/xevrion',              url: 'https://github.com/xevrion' },
  { icon: <FaLinkedin className="w-5 h-5" />,  text: 'linkedin.com/in/yash-bavadiya',   url: 'https://www.linkedin.com/in/yash-bavadiya/' },
  { icon: <FaTwitter className="w-5 h-5" />,   text: 'twitter.com/xevrion',             url: 'https://x.com/xevrion_the1' },
]

export const Contact = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-14 flex flex-col gap-10">
      <SectionLabel>Contact</SectionLabel>

      <div className="max-w-2xl">
        <p className="text-[var(--color-text)] sg-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-3">
          Got something <Mark>worth building</Mark>?
        </p>
        <p className="text-[var(--color-text-muted)] sg-regular text-base sm:text-lg">
          Always open for <Mark>collaborations</Mark>, new ideas, or just a friendly chat.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        {contacts.map((c, idx) => (
          <a
            key={idx}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-3 border border-battleship-gray/20 text-[var(--color-text)] transition-all duration-300 hover:border-soft-royal-blue hover:text-soft-royal-blue hover:translate-x-1"
          >
            {c.icon}
            <span className="sg-regular text-sm truncate">{c.text}</span>
            <ArrowUpRight className="ml-auto w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Contact
