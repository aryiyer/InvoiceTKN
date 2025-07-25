'use client'

import { checkConnection, ethToWei } from "../blockchain/search";
import { mintTkn } from "../blockchain/write";
import {useEffect, useState} from "react";
import { useAccountStore } from "../store/accountStore";
import {useRouter} from "next/navigation";

export default function (){
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function mintButtonClick(formData: FormData){
        const name = String(formData.get("name"));
        const _date = new Date(String(formData.get("date")));
        const currDate = new Date(date);
        const diff = (Number(_date)-Number(currDate));
        const days = diff/1000/60/60/24;

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
            const date1 = new Date();
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
        if (!loading){
            return(
                <div>
                    <form action={mintButtonClick} className={"flex flex-col align-center ml-15 mt-20"}>
                        <div className={"mt-7"}>   
                            <label htmlFor="name">Name of Token:   </label>
                            <input type="text" id="name" name="name" className={"border-1 border-solid border-black rounded-sm"}></input>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="date">Maturity Date:   </label>
                            <input type="date" id="date" name="date" placeholder={date} min={date}/>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="value">Value of Invoice (ETH):   </label>
                            <input type="number" id="value" name="value" className={"border-1 border-solid border-black rounded-sm"} min="0" step="0.0001"></input>
                        </div>

                        <div className={"mt-7"}>   
                            <label htmlFor="yield">Yield:   </label>
                            <input type="number" id="yield" name="yield" step="0.01" className={"border-1 border-solid border-black rounded-sm"} min="0" max="100"></input>%
                        </div>            

                        <div className={"mt-7"}>
                            <button type="submit" className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                Mint!
                            </button>
                        </div>                     
                    </form>                
                </div>
            );
        } else {
            return(
                <div>
                    Loading...
                </div>
            );
        }
    } else {
        return(
            <div>
                you don't have acces to this page brah!!!
            </div>  
        );
    }

}