'use client'

import {useState, useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useTokenStore} from "../../store/dataStore";
import {TokenData2} from "../../store/dataStore";
import {checkConnection, getTokInfo2, isListed2, listingPrice, weiToEth} from "../../blockchain/search";
import OpaqueBox from '@/components/Box';
import { usdToEth } from '@/app/blockchain/nft_abi';
import { useAccountStore } from '@/app/store/accountStore';

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
} as const;

export default function DynamicRoute(props: any){
    const [loading, setLoading] = useState(true);
    const [haveError, setError] = useState(false);
    const [listed, setListed] = useState();
    const [listPrice, setPrice] = useState();
    const [valid, setValid] = useState<Boolean>();
    const [token, setToken] = useState<TokenData2 | null>(null);

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    const storedToken = useTokenStore((state) => state.selectedToken);
    const setSelectedToken = useTokenStore((state) => state.setSelectedToken);
    const rout = useRouter();
    
    const pathname = usePathname(); // /token/{id}/
    const tokenId = Number(pathname.substring(7));
    
    var date = new Date(0);

    function handleClick(url: string, token: any) {
        setSelectedToken(token);
        rout.push(url);
    };

    
    useEffect(() => { 
        async function fetchData() {
            if (!storedToken) {
                console.log("no token found in state, reading from blockchain");
                try {
                    const isListed = await isListed2(tokenId);
                    if (isListed){
                        setPrice(weiToEth(await listingPrice(tokenId)));
                    }
                    setListed(isListed);
                    const t : (TokenData2 | null) = await getTokInfo2(tokenId);
                    if (t == null){
                        console.log("Error in getTokenInfo");
                        setLoading(false);
                        setError(true);
                    } else {
                        console.log("found tokenInfo from blockchain.");
                        setToken(t);
                        setValid(t.valid);                    
                        setLoading(false);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log("token found in state.");
                const isListed = await isListed2(tokenId);
                    if (isListed){
                        setPrice(weiToEth(await listingPrice(tokenId)));
                    }
                    setListed(isListed);
                await setToken(storedToken);       
                setValid(storedToken.valid);                         
                setLoading(false);
            }
            checkConnection(currentAccountInfo, setAccountInfo);

        }
        fetchData();
    }, []);
    
    if (loading) {
        const stuff = (<div className={"flex items-center justify-center text-white font-bold"}>Loading...</div>);
        return(
            <div>
                <OpaqueBox inside={stuff}/>
            </div>
        );
    }

    if (haveError) {
        const stuff = (<div className={"flex items-center justify-center font-bold text-red-500"}>Error!</div>);
        return(
            <div>
                <OpaqueBox inside={stuff} />
            </div>
        );
    }

        return (
        <div className={"min-h-screen"}>
            <OpaqueBox inside={
            (
                <div className={"text-white ml-[7%]"}>
                    <div>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-5xl font-bold"}>{token?.name}</li>
                            <li className={"text-2xl text-gray-200"}>id: #{token?.tokenId}</li>
                        </ul>
                    </div>
                    <div className={"flex flex-row mt-[2%]"}>
                        <div className={"flex flex-col items-end"}>
                            <div className={"text-3xl"}>
                                Final Value: 
                            </div>
                            <div className={"text-xl"}>
                                Invoice Value: 
                            </div>
                        </div>
                        <div className={"flex flex-col"}>
                            <div className={"text-3xl"}>
                                &nbsp; Final Value Placeholder
                            </div>
                            <div className={"text-xl"}>
                                &nbsp; {(weiToEth(Number(token?.value))*3631).toFixed(4)} USD, Yield: {Number(token?.yield)/100}%
                            </div>
                        </div>      
                    </div>    
                    <div className={"text-4xl mt-[2%] font-bold"}>Invoice Details</div>
                    <div className={"flex flex-row align-top mt-[2%]"}>
                        <div className={"flex flex-col items-start"}>                            
                            <div className={"text-2xl"}>  
                                Customer: &nbsp; {token?.customer}
                            </div>
                            <div className={"text-2xl mt-3"}>  
                                Port: &nbsp; {token?.port}
                            </div>
                            <div className={"text-2xl mt-3"}>  
                                Vessel Name: &nbsp; {token?.vesselName}
                            </div>
                        </div> 
                        <div className={"flex flex-col items-start ml-[10%]"}>
                            <div className={"text-2xl"}>  
                                Bunker (Tons): &nbsp; {Number(token?.bunkerQuantity)/1000}
                            </div>
                            <div className={"text-2xl mt-3"}>  
                                Price ($/Ton): &nbsp; ${Number(token?.bunkerPrice)/100}
                            </div>
                            <div className={"text-2xl mt-3"}>  
                                Maturity Date: &nbsp; {(new Date(Number(token?.maturityDate)*1000)).toLocaleDateString(undefined, options)}
                            </div>
                        </div> 
                    </div>
                    <div className={"text-4xl mt-[2%] font-bold"}>Token Information</div>
                    <div className="flex flex-row items-start">
                        <div className={"flex flex-col"}>                            
                            <div className={"text-2xl mt-[3%]"}>  
                                { listed ? <div>List Price: &nbsp;{(listPrice*usdToEth).toFixed(4)} USD </div> : <div></div>}
                            </div>
                            <div className={"text-2xl mt-[3%]"}>  
                                Minter Address: &nbsp; {token?.minter}
                            </div>
                            
                            {token?.valid ? (<div className={"text-2xl mt-[3%] text-teal-500"}>Valid &nbsp;</div>) : (<div className={"text-red-500"}>Invalid &nbsp;</div>) }                            
                        </div>                       
                    </div>
                    <div className={"mt-[3%]"}>
                        {listed ? (
                            <div>
                                <button className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"} onClick={() => handleClick(("/purchase-token/"+String(tokenId)), token)}>
                                    Purchase
                                </button>
                            </div> 
                        ) : (
                            <div>
                                <button className={"border-1 border-solid bg-black/30 text-white font-bold py-4 px-8 rounded-full"}>
                                    Unlisted
                                </button>
                            </div>
                        )}
                    </div>                                   
                </div>

            )} />
        </div>        
    );
    
}