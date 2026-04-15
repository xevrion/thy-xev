// src/pages/Posts.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Fuse from "fuse.js";
import { parsedPosts, readingTime } from "./../utils/posts";
import { usePostViews } from "../hooks/usePostViews";
import SplitText from "../components/reactbits/splittext";
import Socials from "./Socials";
import { Title, Meta, Link as HeadLink } from "react-head";
import { Search, X } from "lucide-react";

type Post = (typeof parsedPosts)[number];

function PostCard({ post, activeTag, onTagClick }: { post: Post; activeTag: string | null; onTagClick: (tag: string) => void }) {
  const views = usePostViews(post.slug);
  return (
    <div className="border-b border-battleship-gray pb-6">
      <div className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl sm:text-3xl text-soft-royal-blue sg-bold mb-1 sm:mb-2 sm:flex-1 sm:min-w-0">
          <Link to={`/posts/${post.slug}`} className="hover:underline sm:truncate block">
            {post.title}
          </Link>
        </h2>
        <div className="flex items-center gap-3 whitespace-nowrap">
          {views !== null && <span className="text-sm sg-regular text-battleship-gray/60">{views} {views === 1 ? "read" : "reads"}</span>}
          <span className="text-sm sg-regular text-battleship-gray/60">{readingTime(post.content)}</span>
          <h3 className="text-lg sg-medium text-battleship-gray">{post.displayDate}</h3>
        </div>
      </div>
      <div className="text-battleship-gray text-lg sg-regular mb-3 [&_h2]:text-xl [&_h2]:text-soft-royal-blue [&_h2]:sg-bold [&_span.blue]:text-soft-royal-blue">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.summary}</ReactMarkdown>
      </div>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-2 py-0.5 rounded-full text-xs sg-medium border transition-colors duration-150 ${
                activeTag === tag
                  ? "bg-soft-royal-blue/10 border-soft-royal-blue text-soft-royal-blue"
                  : "border-battleship-gray/20 text-battleship-gray/70 hover:border-soft-royal-blue/50 hover:text-soft-royal-blue"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const sortedPosts = [...parsedPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const allTags = Array.from(
  new Set(sortedPosts.flatMap((p) => p.tags))
).sort();


export const Posts = () => {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim();
    let pool = sortedPosts;

    // filter by tag first
    if (activeTag) {
      pool = pool.filter((p) => p.tags.includes(activeTag));
    }

    if (!q) return pool;

    const lower = q.toLowerCase();

    const substringMatches = pool.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.summary.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower)
    );

    const fuzzyMatches = new Fuse(pool, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "summary", weight: 0.2 },
        { name: "content", weight: 0.4 },
      ],
      threshold: 0.1,
      minMatchCharLength: 3,
      ignoreLocation: true,
    }).search(q).map((r) => r.item);

    const seen = new Set<string>();
    return [...substringMatches, ...fuzzyMatches].filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });
  }, [query, activeTag]);

  return (
    <>
      <Title>Blog Posts | Xevrion - Full Stack Developer</Title>
      <Meta name="title" content="Blog Posts | Xevrion - Full Stack Developer" />
      <Meta name="description" content="Read my blog posts about web development, Linux, programming challenges, and tech insights. Sharing experiences and learnings from IIT Jodhpur." />
      <HeadLink rel="canonical" href="https://xevrion.dev/posts" />

      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://xevrion.dev/posts" />
      <Meta property="og:title" content="Blog Posts | Xevrion" />
      <Meta property="og:description" content="Read my blog posts about web development, Linux, programming challenges, and tech insights." />
      <Meta property="og:image" content="https://xevrion.dev/android-chrome-512x512.png" />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:url" content="https://xevrion.dev/posts" />
      <Meta name="twitter:title" content="Blog Posts | Xevrion" />
      <Meta name="twitter:description" content="Read my blog posts about web development, Linux, programming challenges, and tech insights." />
      <Meta name="twitter:image" content="https://xevrion.dev/android-chrome-512x512.png" />

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

        {/* Search + tag filters */}
        <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
          {/* Search bar */}
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-battleship-gray pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-battleship-gray/40 bg-transparent text-soft-royal-blue placeholder-battleship-gray/60 sg-regular text-sm focus:outline-none focus:border-soft-royal-blue/60 transition-colors duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-battleship-gray hover:text-soft-royal-blue transition-colors duration-150"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs sg-medium border transition-colors duration-150 ${
                  activeTag === tag
                    ? "bg-soft-royal-blue/10 border-soft-royal-blue text-soft-royal-blue"
                    : "border-battleship-gray/30 text-battleship-gray hover:border-soft-royal-blue/50 hover:text-soft-royal-blue"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts list */}
        <div className="flex flex-col gap-10">
          {results.length > 0 ? (
            results.map((post) => (
              <PostCard key={post.slug} post={post} activeTag={activeTag} onTagClick={(tag) => setActiveTag(activeTag === tag ? null : tag)} />
            ))
          ) : (
            <p className="text-battleship-gray sg-regular text-center">No posts found{activeTag ? ` tagged "${activeTag}"` : ` for "${query}"`}</p>
          )}
        </div>

        <Socials />
      </section>
    </>
  );
};
