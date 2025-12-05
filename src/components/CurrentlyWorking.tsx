import data from '../../constants/projects.json'
import { LinkPreview } from './LinkPreview';

const {projects} = data;

function CurrentlyWorking() {

    return (
        <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl ">
            <div className="inter-bold">Currently Working</div>
            {projects.map((value, index) => {
                return (<>
                    <div key={index} className="flex whitespace-nowrap gap-1">
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
                        <p className="inter-medium text-xl truncate">- {value['desc']}</p>
                    </div>
                </>
                )
            })}

        </div>
    )
}

export default CurrentlyWorking