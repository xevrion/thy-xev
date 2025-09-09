// src/pages/PostPage.tsx
import { useParams } from "react-router-dom";
import { parsedPosts } from "./../utils/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const PostPage = () => {
    const { slug } = useParams();
    const post = parsedPosts.find((p) => p.slug === slug);

    if (!post) return <p className="text-center text-red-500">Post not found!</p>;

    return (
        <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-12 max-w-screen-2xl mx-auto">
            {/* <h1 className="text-4xl text-soft-royal-blue sg-bold mb-6">{post.title}</h1> */}
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // components={{
                //     h1: (props) => <h1 className="text-3xl text-soft-royal-blue sg-medium mb-4" {...props} />,
                //     h2: (props) => <h2 className="text-2xl text-soft-royal-blue sg-bold mb-3" {...props} />,
                //     p: (props) => <p className="text-battleship-gray text-lg mb-4" {...props} />,
                //     a: (props) => <a className="text-soft-royal-blue hover:underline" {...props} target="_blank" />,
                // }}

                components={{
                    h1: (props) => <h1 className="text-2xl sm:text-3xl text-soft-royal-blue sg-medium mb-4" {...props} />,
                    h2: (props) => <h2 className="text-xl sm:text-2xl text-soft-royal-blue sg-bold mb-3" {...props} />,
                    h3: (props) => <h3 className="text-lg sm:text-xl text-soft-royal-blue sg-bold mb-2" {...props} />,
                    p: (props) => <p className="text-battleship-gray text-lg mb-4 sg-regular leading-relaxed" {...props} />,
                    a: (props) => <a className="text-soft-royal-blue hover:underline transition-colors" {...props} target="_blank" />,
                    code: (props) => <code className="bg-battleship-gray text-soft-royal-blue px-1 rounded" {...props} />,
                    blockquote: (props) => (
                        <blockquote className="border-l-4 border-soft-royal-blue pl-4 italic text-battleship-gray my-4" {...props} />
                    ),
                    ul: (props) => <ul className="list-disc ml-6 mb-4" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                    li: (props) => <li className="mb-2 text-battleship-gray" {...props} />,
                    strong: (props) => <strong className="font-bold text-soft-royal-blue" {...props} />,
                    em: (props) => <em className="italic text-battleship-gray" {...props} />,
                }}

            >
                {post.content}
            </ReactMarkdown>
        </section >
    );
};
