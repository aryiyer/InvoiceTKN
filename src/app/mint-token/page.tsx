'use client'

import { checkConnection, ethToWei } from "../blockchain/search";
import { mintTkn2 } from "../blockchain/write";
import {useEffect, useState} from "react";
import { useAccountStore } from "../store/accountStore";
import {useRouter} from "next/navigation";
import OpaqueBox from "@/components/Box";
import { usdToEth } from "../blockchain/nft_abi";
import { BeatLoader } from "react-spinners";


export default function (){
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const [val, setVal] = useState<number>(0);
    const [yieldValue, setYieldValue] = useState<number>(0);
    const [estVal, setEstVal] = useState<String>();
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function mintButtonClick(formData: FormData){
        setLoading(true);
        
        setTimeout(async () => {
            const _date = new Date(String(formData.get("date")));
            const currDate = new Date();
            const diff = (Number(_date)-Number(currDate));    
            var days = diff/1000/60/60/24;

            const inputStruct = {
                yield: Number(formData.get("yield"))*100,
                name: String(formData.get("name")),
                value : String(Number(formData.get("value"))/usdToEth),
                daysAfter : Math.ceil(days),
                customer : String(formData.get("customer")),
                port : String(formData.get("port")),
                vesselName : String(formData.get("vesselName")),
                bunkerQuantity : Number(formData.get("bunkerQuantity"))*1000,
                bunkerPrice : Number(formData.get("bunkerPrice"))*100,
            };        
            
            await mintTkn2(String(currentAccountInfo?.accountAddress), inputStruct);
            setLoading(false);
            rout.push("/my-account/");
        }, 0);
    }

    function getEstVal(newInfo : number, mode : number){
        console.log("newInfo", newInfo);
        console.log("val", val);
        console.log("yield", yieldValue);
        if ((yieldValue != undefined && val != undefined && !Number.isNaN(newInfo))){
            if (mode == 0){
                console.log("gurt0");
                //new info is value            
                setEstVal(String(((newInfo)*(1+yieldValue/100)).toFixed(5)));
            } else {
                //new info is yield
                console.log("yo?", newInfo);
                setEstVal(String(((val)*(1+newInfo/100)).toFixed(5)));
            }
        } else {
            console.log("No inputs for estimated value");
            setEstVal("");
        }

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
                    <div className={"ml-15 text-5xl font-normal"}>
                        Mint an Invoice Token
                    </div>
                    <form action={mintButtonClick} className={"flex flex-col align-center pl-[10%]"}>                
                        <div className={"flex flex-row"}>
                            <div className={"flex flex-col items-end"}>
                                <div className={"mt-7"}>   
                                    <label htmlFor="name">Name of Token: &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}>   
                                    <label htmlFor="value">Value of Invoice (USD): &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}>   
                                    <label htmlFor="yield">Yield: &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}></div>                            

                                <div className={"mt-7"}>   
                                    <label htmlFor="date">Maturity Date: &nbsp; </label>                                
                                </div>
                            </div>
                            <div className={"flex flex-col ml-3"}>
                                <div className={"mt-7"}>                                   
                                    <input type="text" id="name" name="name" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>
                                </div>

                                <div className={"mt-7"}>                                   
                                    <input type="number" id="value" name="value" className={"border-1 border-solid rounded-sm bg-gray-500/30"} min="0" step="0.0001" onChange={(e) => {setVal(Number(e.target.value)); getEstVal(parseFloat(e.target.value), 0);}}></input>
                                </div>

                                <div className={"mt-7"}>                                   
                                    <input type="number" id="yield" name="yield" step="0.01" className={"border-1 border-solid rounded-sm bg-gray-500/30"} min="0" max="100" onChange={(e) => {setYieldValue(Number(e.target.value)); getEstVal(parseFloat(e.target.value), 1);}}></input>&nbsp;%
                                </div>

                                <div className={"font-normal"}>
                                    Estimated Final Value: {estVal}
                                </div>
                                                            

                                <div className={"mt-7"}>                                   
                                    <input className={"font-normal border-1 border-solid rounded-sm bg-gray-500/30"} type="date" id="date" name="date" placeholder={date} min={date}/>
                                </div>
                            </div>
                            <div className={"flex flex-col items-end ml-[10%]"}>
                                <div className={"mt-7"}>   
                                    <label htmlFor="customer">Customer: &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}>   
                                    <label htmlFor="port">Port: &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}>   
                                    <label htmlFor="vesselName">Vessel Name: &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}></div>                                                 

                                <div className={"mt-7"}>   
                                    <label htmlFor="bunkerQuantity">Bunker Quantity (Tons): &nbsp; </label>                                
                                </div>

                                <div className={"mt-7"}>   
                                    <label htmlFor="bunkerPrice">Bunker Price (USD/Ton): &nbsp; </label>                                
                                </div>                             
                            </div>
                            <div className={"flex flex-col"}>
                            <div className={"mt-7"}>                                   
                                    <input type="text" id="customer" name="customer" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>
                                </div>

                                <div className={"mt-7"}>                                   
                                    <input type="text" id="port" name="port" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>
                                </div>

                                <div className={"mt-7"}>                                   
                                    <input type="text" id="vesselName" name="vesselName" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>&nbsp;
                                </div>

                                <div className={"mt-7"}></div>

                                <div className={"mt-7"}>                                   
                                    <input type="number" id="bunkerQuantity" name="bunkerQuantity" step="0.01" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>&nbsp;
                                </div>

                                <div className={"mt-7"}>                                   
                                    <input type="number" id="bunkerPrice" name="bunkerPrice" step="0.01" className={"border-1 border-solid rounded-sm bg-gray-500/30"}></input>&nbsp;
                                </div>                                                        
                                                        
                            </div>
                        </div>
                        <div className={"mt-7 items-center"}>
                            <button type="submit" className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"} >
                                Mint!
                            </button>
                        </div>                
                    </form>                
                </div>
            );
            return(
                <div>
                   { loading ? <OpaqueBox inside={(<div className={"flex items-center justify-center h-full"}><BeatLoader color={"#009688"}/></div>)} /> : <OpaqueBox inside={stuff} /> }                                                                                           
                </div>
            );       
    } else {
        const stuff = (
            <div className={"flex flex-col max-w-full gap-4 justify-evenly"}>
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