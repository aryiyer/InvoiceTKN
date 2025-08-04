'use client'

import {useState, useEffect} from 'react';
import { useAccountStore } from '../store/accountStore';
import { getTokensOwned2, getTokInfo2, getTokensNotListed2, checkConnection, ethToWei } from '../blockchain/search';
import { TokenData2 } from '../store/dataStore';
import {listCoin2} from '../blockchain/write';
import { liveValue } from '../blockchain/search';
import {useRouter} from "next/navigation";
import OpaqueBox from '@/components/Box';
import { usdToEth } from '../blockchain/nft_abi';

export default function (){
    const [loading, setLoading] = useState<Boolean>(false);
    const [ownedData, setOwnedData] = useState<Number[]>([]);
    const [success, setSuccess] = useState<boolean>();
    const [recPrice, setRec] = useState<String>("Select a token to see recommended price.");
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    async function tokensOwned(address: string) {
        const owned: Number[] = await getTokensOwned2(address);
        const listed: Number[] = await getTokensNotListed2(owned);
        var notListedValid : Number[] = [];
        for (let i = 0; i < listed.length; i++){
            const t : TokenData2 = await getTokInfo2(listed[i]);
            if (t.valid){
                notListedValid.push(t.tokenId);
            }
        }
        setOwnedData(notListedValid);
    };    

    async function listButtonClick(formData: FormData){
        setLoading(true);
        //Listing takes in ETH and converts to WEI
        const listRes = await listCoin2(Number(formData.get("tokenId")), Number(ethToWei(Number(formData.get("value"))/usdToEth)));
        setLoading(false);
        setSuccess(listRes);
        
        await sleep(3000);
        rout.push("/marketplace/");
    }

    async function handleChange(event : any){
        if (event.target.value != "Select a Token..."){            
            setRec("$"+String(((Number(await liveValue(Number(event.target.value))))*usdToEth).toFixed(4)) + " USD");
        };
    };

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

    if (loading) {
        <div>
            <OpaqueBox inside={(<div className={"flex items-center justify-center min-h-screen text-white"}>Loading...</div>)} />
        </div>
    }

    if (success==null){}
    else if(success){
        return(
            <div>
                <OpaqueBox inside={(<div className={"flex justify-center text-white"}>Success! Redirecting to Marketplace...</div>)} />
            </div>
            
        );
    } else {
        return(
            <div>
                <OpaqueBox inside={(<div className={"flex justify-center text-white"}>Failed. Redirecting to Marketplace...</div>)} />
            </div>            
        );
    }

    if (!currentAccountInfo) {
        return(
            <div>
                <OpaqueBox inside={(
                    <div className={"flex justify-center text-white"}>
                        <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                            Connect to MetaMask
                        </button>
                    </div>
                )} />
            </div>            
        );
    } else if (!(currentAccountInfo?.accountType == "minter" || currentAccountInfo?.accountType == "investor" || currentAccountInfo?.accountType == "owner")) {
        return(
            <div>
                <OpaqueBox inside={(
                <div className={"flex flex-col max-w-full text-white ml-15 gap-4 items-center"}>
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
                )} />
            </div>                        
        );
    } else {
        return(
            <div>
                <OpaqueBox inside={(
                    <div className={"text-white"}>
                        <ul className={"flex flex-row ml-15 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Your Public Address: </li>
                            <li className={"text-xl text-gray-200"}>{currentAccountInfo.accountAddress}</li>
                        </ul>

                        <form action={listButtonClick} className={"flex flex-col align-center ml-15 mt-20"}>
                            <div>
                                <label htmlFor="tokenId" className={"font-bold"}>Select Token To List: &nbsp; </label>
                                <select id="tokenId" name="tokenId" className={"border-1 border-solid border-white rounded-sm bg-gray-500/30"} onChange={handleChange}>
                                    <option>Select a Token...</option>
                                    {ownedData.map((id: Number, i) => {
                                        return(
                                            <option key={i} className={""} value={Number(id)}>
                                                #{String(id)}
                                            </option>)
                                    })}
                                </select>            
                            </div>

                            <div className={"mt-7 font-bold"}>   
                                <div>Recommended Price: &nbsp; {                            
                                        (recPrice)                                                        
                                    }</div>
                                
                            </div>

                            <div className={"mt-7 font-bold"}>   
                                <label htmlFor="value">Listing Price (USD):  &nbsp; </label>
                                <input type="number" id="value" name="value" className={"border-1 border-solid border-white rounded-sm bg-gray-500/30"} step="0.000001"></input>
                            </div>

                            <div className={"mt-7"}>
                                <button type="submit" className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                    List!
                                </button>
                            </div>
                            
                        </form>
                    </div>
                )} />
            </div>
            
        )
    }

}