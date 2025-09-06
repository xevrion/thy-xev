import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SplitText from './reactbits/splittext'

// @ts-ignore
import post1 from './../posts/post1.md?raw'
// @ts-ignore
import post2 from './../posts/post2.md?raw'

const posts = [
  { title: "My First Post", content: post1 },
  { title: "Building Xevrion.dev", content: post2 },
]

export const Posts = () => {

  // Map Markdown elements to Tailwind classes
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-4xl sm:text-5xl text-soft-royal-blue sg-bold mb-4" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-3xl sm:text-4xl text-soft-royal-blue sg-bold mb-3" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-2xl sm:text-3xl text-soft-royal-blue sg-bold mb-2" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-battleship-gray text-lg mb-4 leading-relaxed" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a className="text-soft-royal-blue hover:underline transition-colors" {...props} />
    ),
    code: ({ node, ...props }: any) => (
      <code className="bg-battleship-gray text-soft-royal-blue px-1 rounded" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4" {...props} />
    ),
    ul: ({ node, ...props }: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal ml-6 mb-4" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-2" {...props} />,
    strong: ({ node, ...props }: any) => (
      <strong className="font-bold text-soft-royal-blue" {...props} />
    ),
    em: ({ node, ...props }: any) => <em className="italic text-battleship-gray" {...props} />,
  }

  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-16">

      {/* Heading */}
      <div className="text-center">
        <SplitText
          text="Posts"
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
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-12">
        {posts.map((post, idx) => (
          <div key={idx} className="max-w-full">
            <h2 className="text-soft-royal-blue sg-bold mb-4 text-2xl sm:text-3xl">{post.title}</h2>

            {/* Markdown content with custom classes */}
            <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Posts
