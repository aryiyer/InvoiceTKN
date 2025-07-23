'use client'

import {useState, useEffect} from 'react';
import { AccountInfo, useAccountStore } from '../store/accountStore';
import { getMMAccounts, getTokensOwned2, getTokensNotListed2, checkConnection } from '../blockchain/search';
import {listCoin2} from '../blockchain/write';
import {useRouter} from "next/navigation";

export default function (){
    const [ownedData, setOwnedData] = useState<Number[]>([]);
    const [success, setSuccess] = useState<boolean>();
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function tokensOwned(address: string) {
        const owned: Number[] = await getTokensOwned2(address);
        const listed: Number[] = await getTokensNotListed2(owned);
        for (let i = 0; i < owned.length; i++){
            console.log(owned[i]);
        }
        setOwnedData(listed);
    };    

    async function listButtonClick(formData: FormData){
        //await listForm(formData);
        const listRes = await listCoin2(Number(formData.get("tokenId")), Number(formData.get("value"))*1000000000);
        setSuccess(listRes);
        
        await sleep(3000);
        rout.push("/marketplace/");
    }

    function sleep(ms : number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        async function getData(){
            checkConnection(currentAccountInfo, setAccountInfo);
            tokensOwned(String(currentAccountInfo?.accountAddress));
        }
        getData();
    }, []);

    if (success==null){}
    else if(success){
        return(
            <div className={"flex justify-center mt-15"}>Success! Redirecting to Marketplace...</div>
        );
    } else {
        return(
            <div className={"flex justify-center mt-15"}>Failed. Redirecting to Marketplace...</div>
        );
    }

    if (!currentAccountInfo) {
        return(
            <div className={"flex justify-center mt-30"}>
                <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
            
        );
    } else if (!(currentAccountInfo?.accountType == "minter" || currentAccountInfo?.accountType == "investor" || currentAccountInfo?.accountType == "owner")) {
        return(
            <div className={"flex flex-col max-w-full mt-20 ml-15 gap-4 items-center"}>
                <div className={"text-xl font-bold"}>
                    Only approved roles can list tokens.
                </div>
                <div>
                    <ul className={"flex flex-row mt-7"}>
                        <li className={"text-xl font-bold"}>Your Public Address: &nbsp;</li>
                        <li className={"text-xl text-gray-700"}>{currentAccountInfo?.accountAddress}</li>
                    </ul>           
                </div>
            </div>            
        );
    } else {
        return(
            <div>
                <ul className={"flex flex-row mt-20 ml-15 gap-4 items-center"}>
                    <li className={"text-xl font-bold"}>Your Public Address: </li>
                    <li className={"text-xl text-gray-700"}>{currentAccountInfo.accountAddress}</li>
                </ul>

                <form action={listButtonClick} className={"flex flex-col align-center ml-15 mt-20"}>
                    <div>
                        <label htmlFor="tokenId">Select Token To List: </label>
                        <select id="tokenId" name="tokenId" className={"border-1 border-solid border-black rounded-sm"}>
                            {ownedData.map((id: Number, i) => {
                                return(
                                    <option key={i} className={""} value={Number(id)}>
                                        #{String(id)}
                                    </option>)
                            })}
                        </select>            
                    </div>

                    <div className={"mt-7"}>   
                        <label htmlFor="value">Price Listing (ETH):   </label>
                        <input type="number" id="value" name="value" className={"border-1 border-solid border-black rounded-sm"} step="0.001"></input>
                    </div>

                    <div className={"mt-7"}>
                        <button type="submit" className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                            List!
                        </button>
                    </div>
                     
                </form>
            </div>
        )
    }

}