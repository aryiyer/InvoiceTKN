'use client'

import { useState, useEffect } from 'react';
import { useAccountStore, AccountInfo } from '../store/accountStore';
import { checkConnection, getMinted2, getTokInfo2, totalValue, weiToEth } from '../blockchain/search';
import { settle } from '../blockchain/write';
import {useRouter} from "next/navigation";
import { TokenData2 } from '../store/dataStore';
import OpaqueBox from '@/components/Box';

export default function() {
    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    const [mintedData, setMinted] = useState<TokenData2[]>([]);
    const [settlePrice, setSettle] = useState<Number>(0);
    const [loading, setLoading] = useState<Boolean>(false);
    const [message, setMessage] = useState<String>("");
    const rout = useRouter();

    async function handleChange(event : any){
        //set settlePrice to the correct value given by event.target.value
        if (event.target.value != "Select a Token..."){
            const alt = await totalValue(event.target.value);
            setSettle(alt);
        };        
    }

    async function handleSettleClick(formData : FormData){
        setMessage("");
        setLoading(true);
        console.log(String(currentAccountInfo?.accountAddress), Number(formData.get("tokenId")), settlePrice);
        const res = await settle(String(currentAccountInfo?.accountAddress), Number(formData.get("tokenId")), settlePrice);
        if (res == "Success") {
            setLoading(false);
            setMessage("Success! Redirecting to token...");
            rout.push("/token/"+String(formData.get("tokenId")));            
        } else {
            setLoading(false)            
            setMessage(res);
        }
    }

    useEffect(() => {
        async function init(){
            await checkConnection(currentAccountInfo, setAccountInfo);
            const minted = await getMinted2(String(currentAccountInfo?.accountAddress));
            var mintedValid : TokenData2[] = [];
            for (let i = 0; i < minted.length; i++){
                const t : TokenData2 = await getTokInfo2(minted[i]);
                if (t.valid){
                    mintedValid.push(t);
                }
            }
            setMinted(mintedValid);
        }

        init();
        
    }, []);


    if (loading) {
        return(
            <div>
                Loading...
            </div>
        );
    }

    if (!currentAccountInfo) {
        const stuff = (
            <div className={"flex justify-center"}>
                <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
        );
        return(
            <div>
                <OpaqueBox inside={stuff} />
            </div>
            
        );
    }

    if ((currentAccountInfo?.accountType != "minter") && (currentAccountInfo?.accountType != "owner")){
        const stuff = (
            <div>
                <ul className={"flex flex-col ml-15"}>
                    <div className={"font-bold text-2xl text-red-700"}>
                        Only Minters can access this page!
                    </div>

                    <div className={"flex flex-row mt-7"}>
                        <li className={"font-bold text-xl"}>Your Public Address: &nbsp; </li>
                        <li className={"text-2xl"}>{currentAccountInfo?.accountAddress}</li>
                    </div>
                </ul>     
            </div>
        );
        
        return(
            <div>
                <OpaqueBox inside={stuff} />
            </div>
        );
    } else {
        const stuff = (
            <div>
                <form action={handleSettleClick} className={"flex flex-col align-center ml-15 text-white"}>
                    <div>
                        <label htmlFor="tokenId" className={"font-bold text-xl"}>Select Token To Settle: &nbsp; </label>
                        <select id="tokenId" name="tokenId" className={"border-1 border-solid border-white rounded-sm bg-gray-500/30"} onChange={handleChange}>
                            <option>Select a Token...</option>
                            {mintedData.map((token: TokenData2, i) => {
                                return(
                                    <option key={i} className={""} value={Number(token.tokenId)}>
                                        #{String(token.tokenId)}
                                    </option>)
                            })}
                        </select>            
                    </div>

                    <div className={"flex flex col mt-7"}>   
                        <ul className={"flex flex-row items-center"}>
                            <li className={"text-xl font-bold"}>
                                Settlement Total: &nbsp;
                            </li>
                            <li className={"text-2xl"}>
                                {weiToEth(settlePrice)} ETH
                            </li>
                            
                        </ul>                        
                    </div>

                    <div className={"mt-7"}>
                        <button type="submit" className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                            Settle!
                        </button>
                    </div>

                    <div className={"font-xl mt-7"}>
                            {message}
                    </div>                     
                </form>
            </div>
        );
        return(
            <div>
                <OpaqueBox inside={stuff} />
            </div>
        );
    }   
}