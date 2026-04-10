// src/pages/Posts.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { parsedPosts } from "./../utils/posts";
import SplitText from "../components/reactbits/splittext";
import Socials from "./Socials";
import { Title, Meta, Link as HeadLink } from "react-head";
import { Search, X } from "lucide-react";

const sortedPosts = [...parsedPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const fuse = new Fuse(sortedPosts, {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "summary", weight: 0.2 },
    { name: "content", weight: 0.4 },
  ],
  threshold: 0.1,
  includeMatches: false,
  minMatchCharLength: 3,
  ignoreLocation: true,
});

export const Posts = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return sortedPosts;
    return fuse.search(q).map((r) => r.item);
  }, [query]);

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

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto w-full">
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

        {/* Posts list */}
        <div className="flex flex-col gap-10">
          {results.length > 0 ? (
            results.map((post) => (
              <div key={post.slug} className="border-b border-battleship-gray pb-6">
                <div className="mb-2 flex flex-row justify-between items-center">
                  <h2 className="text-3xl text-soft-royal-blue sg-bold mb-2 flex-1 min-w-0">
                    <Link to={`/posts/${post.slug}`} className="hover:underline truncate block">
                      {post.title}
                    </Link>
                  </h2>
                  <h3 className="text-lg sg-medium text-battleship-gray whitespace-nowrap">{post.displayDate}</h3>
                </div>
                <p className="text-battleship-gray text-lg sg-regular">{post.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-battleship-gray sg-regular text-center">No posts found for "{query}"</p>
          )}
        </div>

        <Socials />
      </section>
    </>
  );
};
