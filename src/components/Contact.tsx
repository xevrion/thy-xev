import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import SplitText from './reactbits/splittext'
import { Mail } from 'lucide-react' // icons

const contacts = [
  {
    icon: <Mail className="w-5 h-5" />,
    text: "krbavadiya11@gmail.com",
    url: "mailto:krbavadiya11@gmail.com",
  },
  {
    icon: <FaGithub className="w-5 h-5" />,
    text: "github.com/xevrion",
    url: "https://github.com/xevrion",
  },
  {
    icon: <FaLinkedin className="w-5 h-5" />,
    text: "linkedin.com/in/yash-bavadiya",
    url: "https://www.linkedin.com/in/yash-bavadiya-a598a224b/",
  },
  {
    icon: <FaTwitter className="w-5 h-5" />,
    text: "twitter.com/xevrion",
    url: "https://x.com/xevrion_the1",
  },
]

export const Contact = () => {
  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-12">

      {/* Heading */}
      <div className="text-center">
        <SplitText
          text="Get in Touch"
          className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold selection:bg-battleship-gray"
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
        <p className="text-battleship-gray mt-3 text-lg sg-medium">
          Always open for collaborations, new ideas, or just a friendly chat.
        </p>
      </div>

      {/* Contact list */}
      <div className="flex flex-col gap-6 items-center">
        {contacts.map((c, idx) => (
          <a
            key={idx}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xl text-battleship-gray hover:text-soft-royal-blue transition-colors duration-200"
          >
            {c.icon}
            <span className="truncate max-w-xs sm:max-w-sm md:max-w-md">
              {c.text}
            </span>
          </a>
        ))}
      </div>

    </section>
  )
}

export default Contact
