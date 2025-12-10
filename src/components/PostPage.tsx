// src/pages/PostPage.tsx
import { useParams } from "react-router-dom";
import { parsedPosts } from "./../utils/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import remarkHtml from 'remark-html'
import rehypeRaw from "rehype-raw";
import { Title, Meta, Link, Style } from "react-head";

const Tooltip: React.FC<{ message: string; children: React.ReactNode }> = ({
  message,
  children,
}) => {
  return (
    <span className="relative group cursor-help underline decoration-dotted underline-offset-3">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2  hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 ">
        {message}
      </span>
    </span>
  );
};

export const PostPage = () => {
  const { slug } = useParams();
  const post = parsedPosts.find((p) => p.slug === slug);

  if (!post) return <p className="text-center text-red-500">Post not found!</p>;

  // Generate meta description from post content (first 155 chars)
  const metaDescription = post.summary || post.content.slice(0, 155).replace(/[#*`\n]/g, ' ').trim() + '...';
  const pageTitle = `${post.title} | Xevrion`;
  const pageUrl = `https://xevrion.dev/posts/${slug}`;

  return (
    <>
      <Title>{pageTitle}</Title>
      <Meta name="title" content={pageTitle} />
      <Meta name="description" content={metaDescription} />
      <Link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <Meta property="og:type" content="article" />
      <Meta property="og:url" content={pageUrl} />
      <Meta property="og:title" content={post.title} />
      <Meta property="og:description" content={metaDescription} />
      <Meta property="og:image" content="https://xevrion.dev/android-chrome-512x512.png" />
      <Meta property="article:published_time" content={post.date} />
      <Meta property="article:author" content="Xevrion" />

      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:url" content={pageUrl} />
      <Meta name="twitter:title" content={post.title} />
      <Meta name="twitter:description" content={metaDescription} />
      <Meta name="twitter:image" content="https://xevrion.dev/android-chrome-512x512.png" />

      {/* JSON-LD Structured Data for Blog Post */}
      <Style type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": metaDescription,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": "Xevrion",
            "url": "https://xevrion.dev"
          },
          "url": pageUrl,
          "image": "https://xevrion.dev/android-chrome-512x512.png"
        })}
      </Style>

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto">
      {/* <h1 className="text-4xl text-soft-royal-blue sg-bold mb-6">{post.title}</h1> */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: (props) => (
            <h1
              className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-xl sm:text-2xl text-soft-royal-blue sg-bold mb-3"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-lg sm:text-xl text-soft-royal-blue sg-bold mb-2"
              {...props}
            />
          ),
          p: (props) => (
            <p
              className="text-battleship-gray text-lg mb-4 sg-regular leading-relaxed"
              {...props}
            />
          ),
          a: (props) => (
            <a
              className="text-soft-royal-blue hover:underline transition-colors sg-regular"
              {...props}
              target="_blank"
            />
          ),
          code: (props) => (
            <code
              className="bg-[rgba(100,149,237,0.08)] text-soft-royal-blue px-1.5 py-0.5 rounded-md font-mono text-sm  tracking-tight"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4"
              {...props}
            />
          ),
          ul: (props) => <ul className="list-disc ml-6 mb-4" {...props} />,
          ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
          li: (props) => (
            <li className="mb-2 text-battleship-gray sg-regular text-lg" {...props} />
          ),
          strong: (props) => <strong className="font-bold " {...props} />,
          em: (props) => (
            <em className="italic text-battleship-gray" {...props} />
          ),
          span: (
            props: React.HTMLAttributes<HTMLSpanElement> & {
              "data-tooltip"?: string;
            }
          ) => {
            if (props.className === "tooltip") {
              // expects markdown like: <span class="tooltip" data-tooltip="Hello!">Hover me</span>
              return (
                <Tooltip message={props["data-tooltip"] ?? ""}>
                  {props.children}
                </Tooltip>
              );
            }
            return <span {...props} />;
          },
          pre: (props) => (
            <pre
              className="relative bg-[#0e1116] text-[#e6edf3] font-mono text-sm rounded-lg p-4 my-5 whitespace-pre-wrap break-words border border-[rgba(100,149,237,0.2)] shadow-lg shadow-[rgba(0,0,0,0.4)]"
              {...props}
            >
              {/* <div className="absolute top-2 right-3 text-[10px] text-battleship-gray uppercase tracking-widest select-none">
                code
              </div> */}
              {props.children}
            </pre>
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </section>
    </>
  );
};
