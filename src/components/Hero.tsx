import ActivityWidget from './ActivityStatus'
import CurrentlyWorking from './CurrentlyWorking'
import SplitText from './reactbits/splittext'
import Socials from './Socials'
import SpotifyWidget from './SpotifyWidget'
import ContestWidget from './ContestWidget'
import WakatimeWidget from './WakatimeWidget'



// const WAKATIME_API_KEY = import.meta.env.VITE_WAKATIME_API_KEY;


export const Hero = () => {
    return (
        <section className="px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 2xl:px-80 py-10 md:py-20 max-w-screen-2xl mx-auto ">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 w-full">

                {/* Text side */}
                <div className="flex flex-col gap-5 text-center md:text-left">
                    <SplitText
                        text="Hello! I'm"
                        className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-battleship-gray sg-bold selection:bg-blue-crayola"
                        delay={20}
                        duration={1}
                        ease="elastic.out(1, 0.5)"
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                    />
                    <SplitText
                        text="Xevrion"
                        className="text-3xl sm:text-4xl lg:text-5xl mb-1 text-soft-royal-blue sg-bold transition-all duration-150 hover:scale-105 hover:[text-shadow:0_0_10px_#5e7aff] selection:bg-battleship-gray"
                        delay={20}
                        duration={1}
                        ease="elastic.out(1, 0.5)"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                    />
                </div>

                {/* Image */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 border-4 rounded-full border-battleship-gray shrink-0">
                    <img src="src/assets/pfp.gif" alt="pfp" className="w-full h-full object-cover rounded-full" />
                </div>
            </div>

            {/* Widgets */}
            <div className="mt-10 flex flex-col gap-6">
                <SpotifyWidget />
                <ActivityWidget />
                <CurrentlyWorking />
                <ContestWidget />
                <Socials />
                <WakatimeWidget/>
                

            </div>
        </section>
    )
}
