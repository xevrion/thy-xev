// src/pages/PostPage.tsx
import { useParams } from "react-router-dom";
import { parsedPosts, readingTime } from "./../utils/posts";
import { usePostViews } from "../hooks/usePostViews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
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

  const views = usePostViews(slug ?? "", true);

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

      <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl text-lg mx-auto text-battleship-gray sg-regular">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: (props) => (
            <div className="mb-8">
              <h1
                className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-3"
                {...props}
              />
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-battleship-gray/60 sg-regular">{post.displayDate}</span>
                <span className="text-battleship-gray/30">·</span>
                <span className="text-sm text-battleship-gray/60 sg-regular">{readingTime(post.content)}</span>
                {views !== null && (<><span className="text-battleship-gray/30">·</span><span className="text-sm text-battleship-gray/60 sg-regular">{views} {views === 1 ? "read" : "reads"}</span></>)}
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs sg-medium border border-battleship-gray/30 text-battleship-gray/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
              className="text-soft-royal-blue hover:underline transition-colors sg-regular wrap-anywhere"
              {...props}
              target="_blank"
            />
          ),
          code: ({ children, className, node, ...props }: React.HTMLAttributes<HTMLElement> & { node?: unknown }) => {
            // If it has a language/hljs class, it's a fenced block — let rehype-highlight styles apply
            if (className) return <code className={className} {...props}>{children}</code>;
            // Inline code: subtle background, no blue
            return (
              <code
                className="inline-code px-1.5 py-0.5 rounded text-[0.875em] font-mono tracking-tight"
                {...props}
              >{children}</code>
            );
          },
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4"
              {...props}
            />
          ),
          ul: (props) => (<ul className="list-disc ml-6 mb-4" style={{marginLeft: '1.5rem'}} {...props} />),
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
            if (props.className === "blue") {
              // expects markdown like: <span class="blue">text</span>
              return <span className="text-soft-royal-blue">{props.children}</span>;
            }
            return <span {...props} />;
          },
          hr: () => (
            <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-soft-royal-blue/30 to-transparent" />
          ),
          pre: (props) => <pre {...props} />,
          table: (props) => (
            <div className="overflow-x-auto my-5">
              <table
                className="w-full border-collapse text-base text-battleship-gray sg-regular"
                {...props}
              />
            </div>
          ),
          thead: (props) => (
            <thead
              className="border-b-2 border-soft-royal-blue/30"
              {...props}
            />
          ),
          tbody: (props) => <tbody {...props} />,
          tr: (props) => (
            <tr
              className="border-b border-soft-royal-blue/10"
              {...props}
            />
          ),
          th: (props) => (
            <th
              className="text-left text-soft-royal-blue sg-bold px-4 py-2 text-sm"
              {...props}
            />
          ),
          td: (props) => (
            <td
              className="px-4 py-2 text-sm"
              {...props}
            />
          ),
        }}
      >
        {(() => {
          const lines = post.content.split('\n');
          // keep title (line 0), drop Date (line 1) and Tags (line 2), keep rest
          return [lines[0], ...lines.slice(3)].join('\n');
        })()}
      </ReactMarkdown>
    </section>
    </>
  );
};
