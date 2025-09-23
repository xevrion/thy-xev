// import ReactMarkdown from 'react-markdown'
// import remarkGfm from 'remark-gfm'
// import SplitText from './reactbits/splittext'

// // @ts-ignore
// import post1 from './../posts/post1.md?raw'
// // @ts-ignore
// import post2 from './../posts/post2.md?raw'
// // @ts-ignore
// import post3 from './../posts/post3.md?raw'
// // @ts-ignore
// import post4 from './../posts/post4.md?raw'
// // @ts-ignore
// import post5 from './../posts/post5.md?raw'
// import Socials from './Socials'

// const posts = [
//   { title: "My First Post", content: post1 },
//   { title: "Building Xevrion.dev", content: post2 },
//   { title: "Exploring React", content: post3 },
//   { title: "Understanding TypeScript", content: post4 },
//   { title: "Deploying to Vercel", content: post5 },
// ]

// export const Posts = () => {

//   // Map Markdown elements to Tailwind classes
//   const components = {
//     h1: ({ node, ...props }: any) => (
//       <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4" {...props} />
//     ),
//     h2: ({ node, ...props }: any) => (
//       <h2 className="text-xl sm:text-2xl text-soft-royal-blue sg-bold mb-3" {...props} />
//     ),
//     h3: ({ node, ...props }: any) => (
//       <h3 className="text-lg sm:text-xl text-soft-royal-blue sg-bold mb-2" {...props} />
//     ),
//     p: ({ node, ...props }: any) => (
//       <p className="text-battleship-gray text-lg mb-4 leading-relaxed" {...props} />
//     ),
//     a: ({ node, ...props }: any) => (
//       <a className="text-soft-royal-blue hover:underline transition-colors" {...props} target='_blank' />
//     ),
//     code: ({ node, ...props }: any) => (
//       <code className="bg-battleship-gray text-soft-royal-blue px-1 rounded" {...props} />
//     ),
//     blockquote: ({ node, ...props }: any) => (
//       <blockquote className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4" {...props} />
//     ),
//     ul: ({ node, ...props }: any) => <ul className="list-disc ml-6 mb-4" {...props} />,
//     ol: ({ node, ...props }: any) => <ol className="list-decimal ml-6 mb-4" {...props} />,
//     li: ({ node, ...props }: any) => <li className="mb-2 text-battleship-gray" {...props} />,
//     strong: ({ node, ...props }: any) => (
//       <strong className="font-bold text-soft-royal-blue" {...props} />
//     ),
//     em: ({ node, ...props }: any) => <em className="italic text-battleship-gray" {...props} />,
//   }

//   return (
//     <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto flex flex-col gap-16">

//       {/* Heading */}
//       <div className="text-center">
//         <SplitText
//           text="Posts"
//           className="text-5xl sm:text-6xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold selection:bg-battleship-gray"
//           delay={20}
//           duration={1}
//           ease="elastic.out(1, 0.5)"
//           splitType="chars"
//           from={{ opacity: 0, y: 40 }}
//           to={{ opacity: 1, y: 0 }}
//           threshold={0.1}
//           rootMargin="-100px"
//           textAlign="center"
//         />
//       </div>

//       {/* Posts */}
//       <div className="flex flex-col gap-12">
//         {posts.map((post, idx) => (
//           <div key={idx} className="max-w-full">
//             <h2 className="text-soft-royal-blue sg-bold mb-4 text-3xl sm:text-4xl">{post.title}</h2>

//             {/* Markdown content with custom classes */}
//             <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
//               {post.content}
//             </ReactMarkdown>
//           </div>
//         ))}
//       </div>
//       <div className="mt-10 flex flex-col gap-6 bottom-0">
      
//               <Socials />
//             </div>
//     </section>
//   )
// }

// export default Posts


// src/pages/Posts.tsx
import { Link } from "react-router-dom";
import { parsedPosts } from "./../utils/posts";
import SplitText from "../components/reactbits/splittext";
import Socials from "./Socials";

export const Posts = () => {
  return (
    <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto flex flex-col gap-12">
      
      {/* Heading */}
      <div className="text-center">
        <SplitText
          text="Posts"
          className="text-5xl sm:text-6xl text-soft-royal-blue sg-bold mb-6"
          delay={20}
          duration={1}
          ease="elastic.out(1, 0.5)"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-10">
        {parsedPosts.map((post) => (
          <div key={post.slug} className="border-b border-battleship-gray pb-6">
            <div className="mb-2 flex flex-row justify-between items-center">
              <h2 className="text-3xl text-soft-royal-blue sg-bold mb-2">
                <Link to={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <h3 className="text-lg sg-medium text-battleship-gray">{post.date}</h3>
            </div>
            <p className="text-battleship-gray text-lg">{post.summary}</p>
          </div>
        ))}
      </div>
      <Socials />
    </section>
  );
};
