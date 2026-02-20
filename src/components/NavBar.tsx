import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons
import DiscordWidget from "./OnlineStatus";
import WeatherWidget from "./WeatherWidget";
import { ThemeToggle } from "./ThemeToggle";


export const NavBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    const links = ["Projects", "Posts", "About", "Contact"];

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
                    .map((link) => (
                        <a
                            key={link}
                            href={`/${link.toLowerCase()}`}
                            className="relative font-space-grotesk text-base sm:text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-250
                            after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue
                            after:transition-all after:duration-250 hover:after:w-full hover:after:left-0"
                        >
                            {link}
                        </a>
                    ))}
                <ThemeToggle />
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
                className={`fixed top-0 left-0 w-full h-screen backdrop-blur-md bg-black/20 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"
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
