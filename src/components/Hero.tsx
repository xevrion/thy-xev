import SplitText from './reactbits/splittext'
import SpotifyWidget from './SpotifyWidget'

export const Hero = () => {
    return (
        <section className='px-80 py-20 max-w-1200px '>
            <div className='flex flex-row  items-center   gap-20  w-full'>
                <div className='gap-5 flex flex-wrap flex-row'>
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
                        text=" Xevrion"
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
                    <div className='size-50 md:size-40 sm:size-30 border-5 rounded-full border-battleship-gray'>
                        <img src="src\assets\pfp.jpeg" alt="pfp" className='rounded-full ' />
                    </div>
            </div>
            <div>
                <SpotifyWidget/>
            </div>
        </section>
    )
}
