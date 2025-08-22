import React from 'react'

export const NavBar = () => {

    const links = ["Home", "Projects", "Posts", "About", "Contact"];
    return (
        <nav className='flex justify-between items-end px-8 py-5 bg-transparent sticky top-0 z-50'>
            <a href="/">
                <div className='sg-bold text-xl text-soft-royal-blue'>xevrion<span className='text-white'>.</span>dev</div>
            </a>


            <div className="flex gap-8">
                {links.map((link) => (
                    <a
                        key={link}
                        href={`/${link.toLowerCase()}`}
                        className="relative font-space-grotesk font-medium text-soft-royal-blue opacity-80 transition-colors duration-300 
                     after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:bg-soft-royal-blue 
                     after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </nav>

    )
}
