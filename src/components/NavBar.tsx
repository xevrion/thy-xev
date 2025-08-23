import React from 'react'
import { useLocation } from 'react-router-dom';

export const NavBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const links = ["Projects", "Posts", "About", "Contact"];
    return (
        <nav className='flex justify-between items-end px-8 py-5 bg-transparent sticky top-0 z-50'>
            <a href="/">
                <div className='sg-bold text-2xl text-soft-royal-blue transition-all duration-200 hover:scale-[1.05] hover:[text-shadow:0_0_10px_#5e7aff]'>xevrion<span className='text-white'>.</span>dev</div>
            </a>

            <div className="flex gap-8">
                {links.filter((link) => `/${link.toLowerCase()}` !== currentPath).map((link) => (
                    <a
                        key={link}
                        href={`/${link.toLowerCase()}`}
                        className="relative font-space-grotesk text-lg font-bold text-soft-royal-blue opacity-80 transition-colors duration-250 
                     after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue 
                     after:transition-all after:duration-250 hover:after:w-full hover:after:left-0"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </nav>

    )
}
