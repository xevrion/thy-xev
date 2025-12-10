// src/pages/Posts.tsx
import { Link } from "react-router-dom";
import { parsedPosts } from "./../utils/posts";
import SplitText from "../components/reactbits/splittext";
import Socials from "./Socials";
import { Title, Meta, Link as HeadLink } from "react-head";

export const Posts = () => {
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

      {/* Posts list */}
      <div className="flex flex-col gap-10">
        {parsedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post) => (
            <div key={post.slug} className="border-b border-battleship-gray pb-6">
              <div className="mb-2 flex flex-row justify-between items-center">
                <h2 className="text-3xl text-soft-royal-blue sg-bold mb-2 flex-1 min-w-0">
                  <Link to={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <h3 className="text-lg sg-medium text-battleship-gray whitespace-nowrap">{post.displayDate}</h3>
              </div>
              <p className="text-battleship-gray text-lg sg-regular">{post.summary}</p>
            </div>
          ))}
      </div>
      <Socials />
    </section>
    </>
  );
};
