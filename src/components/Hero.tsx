import { section } from 'motion/react-client'
import React from 'react'
import SplitText from './reactbits/splittext'

export const Hero = () => {
    return (
        <section className='px-80 py-20 max-w-1200px m-auto'>
            <div className='flex items-center justify-between gap-20 flex-wrap'>
                <div className='gap-5 flex'>
                    <SplitText
                        text="Hello! I'm"
                        className="text-[4rem]  mb-[1px] text-battleship-gray sg-bold"
                        delay={20}
                        duration={1}
                        ease="elastic.out(1, 0.5)"
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center" />
                    <SplitText
                        text=" Xevrion "
                        className="text-[4rem]  mb-[1px] text-soft-royal-blue sg-bold"
                        delay={20}
                        duration={1}
                        ease="elastic.out(1, 0.5)"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center" />
                    
                </div>
            </div>
        </section>
    )
}
