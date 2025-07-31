'use client'

import {useState, useEffect} from 'react';
import { getTokensOwned2, getTokensListed2, checkConnection } from '../blockchain/search';
import { useAccountStore } from '../store/accountStore';
import {delistCoin2} from '../blockchain/write';
import {useRouter} from "next/navigation";
import OpaqueBox from '@/components/Box';

export default function (){
    const [ownedData, setOwnedData] = useState<Number[]>([]);
    const [success, setSuccess] = useState<boolean>();
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function tokensOwned(address: string) {
        const owned: Number[] = await getTokensOwned2(address);
        const listed: Number[] = await getTokensListed2(owned);
        setOwnedData(listed);
    };    

    async function listButtonClick(formData: FormData){
        //await listForm(formData);
        await delistCoin2(Number(formData.get("tokenId")));
        rout.push("/marketplace/");
    }

    useEffect(() => {
        async function getData(){
            //obtain connection to MM account
            checkConnection(currentAccountInfo, setAccountInfo);
            tokensOwned(String(currentAccountInfo?.accountAddress));
        }
        getData();
    }, []);

    if (success == null){}
    else if (success){
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
            <div className={"text-white"}>
                <OpaqueBox inside={(
                    <div className={"flex justify-center"}>
                        <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                            Connect to MetaMask
                        </button>
                    </div>
                )} />
            </div>            
        );
    } else if (!(currentAccountInfo?.accountType == "minter" || currentAccountInfo?.accountType == "investor" || currentAccountInfo?.accountType == "owner")) {
        return(
            <div className={"text-white"}>
                <OpaqueBox inside={(
                    <div className={"flex flex-col max-w-full ml-15 gap-4 items-center"}>
                        <div className={"text-xl font-bold"}>
                            Only approved roles can delist tokens.
                        </div>
                        <div>
                            <ul className={"flex flex-row mt-7"}>
                                <li className={"text-xl font-bold"}>Your Public Address: &nbsp;</li>
                                <li className={"text-xl text-gray-200"}>{currentAccountInfo?.accountAddress}</li>
                            </ul>           
                        </div>
                    </div>     
                )} />
            </div>
                   
        );
    } else {
        return(
            <div className={"text-white"}>
                <OpaqueBox inside={(
                    <div>
                        <ul className={"flex flex-row ml-15 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Your Public Address: </li>
                            <li className={"text-xl text-gray-200"}>{currentAccountInfo.accountAddress}</li>
                        </ul>

                        <form action={listButtonClick} className={"flex flex-col align-center ml-15 mt-20"}>
                            <div>
                                <label htmlFor="tokenId">Select Token To Delist: </label>
                                <select id="tokenId" name="tokenId" className={"border-1 border-solid border-white rounded-sm"}>
                                    {ownedData.map((id: Number, i) => {
                                        return(
                                            <option key={i} className={""} value={Number(id)}>
                                                #{String(id)}
                                            </option>)
                                    })}
                                </select>            
                            </div>

                            <div className={"mt-7"}>
                                <button type="submit" className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                    Delist!
                                </button>
                            </div>                     
                        </form>
                    </div>
                )} />
            </div>            
        )
    }

}