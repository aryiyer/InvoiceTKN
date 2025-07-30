'use client'

export default function Butt(props: any){ //prop should be an array of pairs, title and link
    const butts = [];
    for (let i = 0; i < props.links.length; i++){
        var color = ["hover:text-teal-200", "hover:text-teal-300", "hover:text-teal-400", "hover:text-teal-500", "hover:text-teal-600", "hover:text-teal-700"];
        console.log(color);
        butts.push(
            <div key={i}>
                <a href={props.links[i]}>
                <button className={"border-1 border-solid text-white font-bold py-2 px-6 rounded-lg "+color[i]} >
                    {props.strs[i]}
                </button>    
                </a>                
            </div>
        );
    }
    return (
        <div className={"flex flex-row w-full justify-end gap-10 mr-[5%]"}>
            {butts}
        </div>
        
    );
}