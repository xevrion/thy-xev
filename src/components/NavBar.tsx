// import { useLocation } from 'react-router-dom';
// import DiscordWidget from './OnlineStatus';

// export const NavBar = () => {
//     const location = useLocation();
//     const currentPath = location.pathname;

//     const links = ["Projects", "Posts", "About", "Contact"];
//     return (
//         <nav className='flex justify-between items-end px-8 py-5 bg-transparent sticky top-0 z-50'>
//             <div className='flex gap-2'>
//                 <a href="/">
//                     <div className='sg-bold text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-[1.05] hover:[text-shadow:0_0_10px_#5e7aff]'>xevrion<span className='text-white selection:bg-black'>.</span>dev |</div>
//                 </a>
//                 <DiscordWidget/>
//             </div>


//             <div className="flex gap-8">
//                 {links.filter((link) => `/${link.toLowerCase()}` !== currentPath).map((link) => (
//                     <a
//                         key={link}
//                         href={`/${link.toLowerCase()}`}
//                         className="relative font-space-grotesk text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-250 
//                      after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue 
//                      after:transition-all after:duration-250 hover:after:w-full hover:after:left-0"
//                     >
//                         {link}
//                     </a>
//                 ))}
//             </div>
//         </nav>

//     )
// }

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger icons
import DiscordWidget from "./OnlineStatus";

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

    const links = ["Projects", "Posts", "About", "Contact"];

    return (
        <nav className={`flex justify-between items-center px-6 sm:px-8 py-4  sticky top-0 z-50 transition-all duration-150 ${scrolled ? ' bg-gradient-to-b from-taupe  to-transparent backdrop-blur-[1px]':'bg-transparent'}`}>
            {/* Logo + Discord */}
            <div className="flex items-center gap-2">
                <a href="/">
                    <div className="sg-bold text-xl sm:text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff]">
                        xevrion<span className="text-white selection:bg-black">.</span>dev |
                    </div>
                </a>
                <DiscordWidget />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-8">
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
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-soft-royal-blue"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-black/80 shadow-lg p-4 flex flex-col gap-4 md:hidden">
                    {links
                        .filter((link) => `/${link.toLowerCase()}` !== currentPath)
                        .map((link) => (
                            <a
                                key={link}
                                href={`/${link.toLowerCase()}`}
                                className="font-space-grotesk text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-200 hover:opacity-100"
                                onClick={() => setIsOpen(false)} // close menu after click
                            >
                                {link}
                            </a>
                        ))}
                </div>
            )}
        </nav>
    );
};
