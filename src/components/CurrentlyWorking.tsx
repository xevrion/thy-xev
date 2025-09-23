import data from '../../constants/projects.json'

const {projects} = data;

function CurrentlyWorking() {

    return (
        <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl ">
            <div className="inter-bold">Currently Working</div>
            {projects.map((value) => {
                return (<>
                    <div className="flex gap-1">
                        <a href={value['url']} className="hover:underline inter-medium text-xl " target="_blank">{value['text']}</a>
                        <p className="inter-medium text-xl">- {value['desc']}</p>
                    </div>
                </>
                )
            })}

        </div>
    )
}

export default CurrentlyWorking