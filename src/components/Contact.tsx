'use client'

import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import SplitText from './reactbits/splittext'
import { Mail } from 'lucide-react'

const contacts = [
  { icon: <Mail className="w-5 h-5" />,        text: 'me@xevrion.dev',                 url: 'mailto:me@xevrion.dev' },
  { icon: <FaGithub className="w-5 h-5" />,    text: 'github.com/xevrion',              url: 'https://github.com/xevrion' },
  { icon: <FaLinkedin className="w-5 h-5" />,  text: 'linkedin.com/in/yash-bavadiya',   url: 'https://www.linkedin.com/in/yash-bavadiya-a598a224b/' },
  { icon: <FaTwitter className="w-5 h-5" />,   text: 'twitter.com/xevrion',             url: 'https://x.com/xevrion_the1' },
]

export const Contact = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-14 flex flex-col gap-12">
      <div className="text-center">
        <SplitText
          text="Get in Touch"
          className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold selection:bg-battleship-gray"
          delay={50}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <p className="text-battleship-gray/60 mt-3 text-base sg-regular">
          Always open for collaborations, new ideas, or just a friendly chat.
        </p>
      </div>

      <div className="flex flex-col gap-6 items-center">
        {contacts.map((c, idx) => (
          <a
            key={idx}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xl text-battleship-gray hover:text-soft-royal-blue hover:scale-[1.05] transition-all duration-250"
          >
            {c.icon}
            <span className="truncate max-w-xs sm:max-w-sm md:max-w-md">{c.text}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Contact
