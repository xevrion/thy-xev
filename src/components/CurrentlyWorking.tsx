export const projects = [
    {
        "url": "https://github.com/xevrion/thy-xev",
        "text": "portfolio (this website)",
        "desc": "designing my own personal website~",
    },
    {
        "url": "https://github.com/xevrion",
        "text": "design credit",
        "desc": "finetuning an LLM for document summarization",
    },
    {
        "url": "https://codeforces.com",
        "text": "dsa questions",
        "desc": "for placement~",
    },

]


function CurrentlyWorking() {

    return (
        <div className="text-battleship-gray flex flex-col gap-1 sm:gap-0 text-xl">
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