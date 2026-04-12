import { useState } from 'react'
import data from '../../constants/projects.json'
import { LinkPreview } from './LinkPreview';
import { HandwrittenHint } from './HandwrittenHint';

const {projects} = data;

function CurrentlyWorking() {
    const [showHint, setShowHint] = useState(true)

    return (
        <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl ">
            <div className="inter-bold">Currently Working</div>
            {projects.map((value, index) => {
                return (
                    <div
                        key={index}
                        className="relative flex whitespace-nowrap gap-2 items-center overflow-visible"
                    >
                        {index === 0 && (
                            <HandwrittenHint
                                visible={showHint}
                                text="hover me for a sneak peek!"
                                arrowPath="M 2 10 C 8 4, 18 4, 26 8 M 26 3 L 26 8 L 21 8"
                                arrowViewBox="0 0 30 18"
                                arrowWidth={36}
                                arrowHeight={22}
                                flexDir="flex-row-reverse"
                                textRotation="rotate-1"
                                className="right-full mr-3 top-1/2 -translate-y-1/2 hidden md:flex"
                            />
                        )}
                        <span onMouseEnter={index === 0 ? () => setShowHint(false) : undefined}>
                        {value['image'] ? (
                            <LinkPreview
                                url={value['url']}
                                isStatic={true}
                                imageSrc={value['image']}
                                className="hover:underline inter-medium text-xl"
                            >
                                {value['text']}
                            </LinkPreview>
                        ) : (
                            <LinkPreview
                                url={value['url']}
                                className="hover:underline inter-medium text-xl"
                            >
                                {value['text']}
                            </LinkPreview>
                        )}
                        </span>
                        {value['live'] && (
                            <a 
                                href={value['live']} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-0.5 border border-battleship-gray/30 rounded hover:bg-battleship-gray/10 transition-colors inter-medium"
                            >
                                live
                            </a>
                        )}
                        <p className="inter-medium text-xl truncate">- {value['desc']}</p>
                    </div>
                )
            })}

        </div>
    )
}

export default CurrentlyWorking