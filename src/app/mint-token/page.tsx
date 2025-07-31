'use client'

import { checkConnection, ethToWei } from "../blockchain/search";
import { mintTkn } from "../blockchain/write";
import {useEffect, useState} from "react";
import { useAccountStore } from "../store/accountStore";
import {useRouter} from "next/navigation";
import OpaqueBox from "@/components/Box";


export default function (){
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function mintButtonClick(formData: FormData){
        const name = String(formData.get("name"));
        const _date = new Date(String(formData.get("date")));
        const currDate = new Date();
        const diff = (Number(_date)-Number(currDate));    
        var days = diff/1000/60/60/24;
        days = Math.ceil(days);        

        var value = String(formData.get("value"));
        var _yield = Number(formData.get("yield"))*100;        
        
        await setLoading(true);
        //Minting with value in WEI
        await mintTkn(name, String(currentAccountInfo?.accountAddress), String(currentAccountInfo?.accountAddress), days, value, _yield);
        setLoading(false);
        rout.push("/my-account/");
    }

    useEffect(() => {
        async function init() {
            checkConnection(currentAccountInfo, setAccountInfo);
            var date1 = new Date();
            date1.setDate(date1.getDate()+1);
            const date = date1.getDate();
            var mon =String(date1.getMonth() + 1);
            if (Number(mon) < 10){
                mon = "0"+mon;
            }
            const year = date1.getFullYear();
            const currDate = year+"-"+mon+"-"+date;            
            setDate(currDate);
        }

        init();
    }, [])

    if (currentAccountInfo?.accountType == "minter" || currentAccountInfo?.accountType == "owner"){   
            const stuff = (              
                <div className={"text-white font-bold border-white"}>
                    <form action={mintButtonClick} className={"flex flex-col align-center ml-15"}>
                        <div className={"mt-7"}>   
                            <label htmlFor="name">Name of Token: &nbsp; </label>
                            <input type="text" id="name" name="name" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="date">Maturity Date: &nbsp; </label>
                            <input className={"font-normal border-1 border-solid rounded-sm bg-gray-500/30"} type="date" id="date" name="date" placeholder={date} min={date}/>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="value">Value of Invoice (ETH): &nbsp; </label>
                            <input type="number" id="value" name="value" className={"border-1 border-solid rounded-sm bg-gray-500/30"} min="0" step="0.0001"></input>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="yield">Yield: &nbsp; </label>
                            <input type="number" id="yield" name="yield" step="0.01" className={"border-1 border-solid rounded-sm bg-gray-500/30"} min="0" max="100"></input>&nbsp;%
                        </div>            

                        <div className={"mt-7"}>
                            <button type="submit" className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                Mint!
                            </button>
                        </div>                     
                    </form>                
                </div>
            );
            return(
                <div>
                   { loading ? <OpaqueBox inside={(<div>Loading...</div>)} /> : <OpaqueBox inside={stuff} /> }                                                                                           
                </div>
            );       
    } else {
        const stuff = (
            <div className={"flex flex-col max-w-full gap-4 items-center"}>
                <div className={"text-xl text-white font-bold"}>
                    Only minters can mint tokens.
                </div>

                <div>
                    <ul className={"flex flex-row mt-7"}>
                        <li className={"text-xl text-white font-bold"}>Your Public Address: &nbsp;</li>
                        <li className={"text-xl text-gray-200"}>{currentAccountInfo?.accountAddress}</li>
                    </ul>           
                </div>
            </div>
        );
        return(
            <div>
                <OpaqueBox inside={stuff}/>
            </div>
        );
    }

}