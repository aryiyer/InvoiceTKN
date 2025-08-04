'use client'

export default function OpaqueBox(props: any){
    return(
        <div className={"flex justify-center"}>
            <div className={"bg-black/50 pt-12 pb-12 mt-10 mb-20 w-[80%] rounded-xl"}>
                {props.inside}
            </div>
        </div>
    )
}