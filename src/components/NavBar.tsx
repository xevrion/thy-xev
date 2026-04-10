import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons
import DiscordWidget from "./OnlineStatus";
import WeatherWidget from "./WeatherWidget";
import { ThemeToggle } from "./ThemeToggle";
import { HandwrittenHint } from "./HandwrittenHint";
import { parsedPosts } from "../utils/posts";


export const NavBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showThemeHint, setShowThemeHint] = useState(true);
    const [showPostHint, setShowPostHint] = useState(true);

    const latestPost = [...parsedPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const latestTitle = latestPost ? (latestPost.title.length > 28 ? latestPost.title.slice(0, 28) + '…' : latestPost.title) : '';

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 70;
            setScrolled(isScrolled);
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll); // cleaning up / removing the thing when the component is unmounted
    }, [])

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen])

    const links = ["Projects", "Posts", "About", "Contact", "Resume"];

    return (
        <nav className={`flex justify-between items-center px-6 sm:px-8 py-4  sticky top-0 z-50 transition-all duration-150 ${scrolled && !isOpen ? ' bg-gradient-to-b from-taupe  to-transparent backdrop-blur-[1px]' : 'bg-transparent'}`}>
            {/* Logo + Discord */}
            <div className="flex items-center gap-2">
                <a href="/">
                    <div className="sg-bold text-xl sm:text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff]">
                        xevrion<span className="text-silver selection:bg-black">.</span>dev |
                    </div>
                </a>
                <DiscordWidget />
                <WeatherWidget />
            </div>

            {/* Desktop Links + Theme Toggle */}
            <div className="hidden md:flex items-center gap-8">
                {links
                    .filter((link) => `/${link.toLowerCase()}` !== currentPath)
                    .map((link) => {
                        if (link === 'Posts' && currentPath === '/') {
                            return (
                                <div key={link} className="relative overflow-visible" onMouseEnter={() => setShowPostHint(false)}>
                                    <HandwrittenHint
                                        visible={showPostHint}
                                        text="new post — check it out!"
                                        subtitle={latestTitle}
                                        arrowPath="M 5 45 L 15 37 L 20 25 L 25 13 L 28 5 M 20 11 L 28 5 L 34 11"
                                        arrowViewBox="0 0 50 50"
                                        arrowWidth={60}
                                        arrowHeight={60}
                                        flexDir="flex-row-reverse"
                                        alignment="items-end"
                                        textRotation="rotate-2"
                                        className="top-full right-0 mt-1"
                                    />
                                    <a
                                        href="/posts"
                                        className="relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-250
                                        after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue
                                        after:transition-all after:duration-250 hover:after:w-full hover:after:left-0"
                                    >
                                        Posts
                                    </a>
                                </div>
                            )
                        }
                        if (link === 'Resume') {
                            return (
                                <a
                                    key={link}
                                    href="/resume"
                                    className="relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue opacity-60 transition-all duration-250 border-b border-dashed border-soft-royal-blue/50 hover:opacity-90 pb-[1px]"
                                >
                                    Resume
                                </a>
                            )
                        }
                        return (
                            <a
                                key={link}
                                href={`/${link.toLowerCase()}`}
                                className="relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-250
                                after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue
                                after:transition-all after:duration-250 hover:after:w-full hover:after:left-0"
                            >
                                {link}
                            </a>
                        )
                    })}
                {/* Theme toggle with handwritten hint on home page */}
                <div
                    className="relative overflow-visible"
                    onClick={() => setShowThemeHint(false)}
                >
                    <HandwrittenHint
                        visible={showThemeHint && currentPath === '/'}
                        text="try changing the theme!"
                        arrowPath="M 21 31 L 22 23 L 20 14 L 21 4 M 15 10 L 21 4 L 27 10"
                        arrowViewBox="0 0 30 33"
                        arrowWidth={45}
                        arrowHeight={50}
                        flexDir="flex-col"
                        alignment="items-end"
                        textRotation="-rotate-3"
                        className="top-full right-0 mt-1"
                    />
                    <ThemeToggle />
                </div>
            </div>


            {/* Mobile Menu Button + Theme Toggle */}
            <div className="flex md:hidden items-center gap-2">
                <ThemeToggle />
                <button
                    className="text-soft-royal-blue z-50 relative"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={`fixed top-0 left-0 w-full h-screen backdrop-blur-md bg-taupe/75 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"
                    } md:hidden`}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {links
                        .filter((link) => `/${link.toLowerCase()}` !== currentPath)
                        .map((link) => (
                            <a
                                key={link}
                                href={`/${link.toLowerCase()}`}
                                className="font-space-grotesk text-2xl font-bold text-soft-royal-blue opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105"
                                onClick={() => setIsOpen(false)}
                            >
                                {link}
                            </a>
                        ))}
                </div>
            </div>

        </nav>
    );
};
