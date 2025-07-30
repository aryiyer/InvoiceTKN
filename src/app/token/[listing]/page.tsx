'use client'

import {useState, useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useTokenStore} from "../../store/dataStore";
import {TokenData2} from "../../store/dataStore";
import {getTokInfo2, isListed2, listingPrice, weiToEth} from "../../blockchain/search";
import OpaqueBox from '@/components/Box';

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  fractionalSecondDigits: 2,
} as const;

export default function DynamicRoute(props: any){
    const [loading, setLoading] = useState(true);
    const [haveError, setError] = useState(false);
    const [listed, setListed] = useState();
    const [listPrice, setPrice] = useState();
    const [valid, setValid] = useState<Boolean>();
    const [token, setToken] = useState<TokenData2 | null>(null);

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
                    setListed(await isListed2(tokenId));
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
                setListed(await isListed2(tokenId));
                await setToken(storedToken);       
                setValid(storedToken.valid);                         
                setLoading(false);
            }
            if (listed){
                setPrice(weiToEth(await listingPrice(tokenId)));
            }
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

    if (listed){

        var validBlock;
        if (valid){
            validBlock = (
                <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                    <li className={"text-xl font-bold text-green-700"}>Valid </li>
                </ul>
            );
        } else {
            validBlock = (
                <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                    <li className={"text-xl font-bold text-red-700"}>Invalid </li>
                </ul>
            );        
        }

        const stuff = (
            <div className="text-white">
            <ul className={"flex flex-row items-center justify-evenly"}>
                <li>
                    <div className={""}>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>{token?.name}</li>
                            <li className={"text-xl text-gray-200"}>id: #{token?.tokenId}</li>
                        </ul>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Invoice Value: </li>
                            <li className={"text-3xl"}>{weiToEth(Number(token?.value))} ETH</li>
                            <li className={"text-xl text-gray-200"}>{Number(token?.yield)/100}%</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Token Price: </li>
                            <li className={"text-3xl"}>{listPrice} ETH</li>                            
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted by: </li>
                            <li className={"text-xl text-gray-200"}>{token?.minter}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted Date: </li>
                            <li className={"text-xl text-gray-200"}>{(new Date(Number(token?.mintedDate)*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Maturity Date: </li>
                            <li className={"text-xl text-gray-200"}>{(new Date(Number(token?.maturityDate)*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>

                        {validBlock}

                    </div>
                </li>
                <li>
                    <div className={"mt-30"}>
                        <button className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"} onClick={() => handleClick(("/purchase-token/"+String(tokenId)), token)}>
                            Purchase
                        </button>
                    </div>                    
                </li>
            </ul>
        </div>
        );


        return (
        <div>
            <OpaqueBox inside={stuff} />
        </div>        
    );
    } else {

        var validBlock;
        if (valid){
            validBlock = (
                <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                    <li className={"text-xl font-bold text-green-700"}>Valid </li>
                </ul>
            );
        } else {
            validBlock = (
                <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                    <li className={"text-xl font-bold text-red-700"}>Invalid </li>
                </ul>
            );        
        }

        const stuff = (
            <div className={"text-white"}>
            <ul className={"flex flex-row items-center justify-evenly"}>
                <li>
                    <div className={""}>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>{token?.name}</li>
                            <li className={"text-xl text-gray-200"}>id: #{token?.tokenId}</li>
                        </ul>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>{weiToEth(Number(token?.value))} ETH</li>
                            <li className={"text-xl text-gray-200"}>{Number(token?.yield)/100}%</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted by: </li>
                            <li className={"text-xl text-gray-200"}>{token?.minter}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted Date: </li>
                            <li className={"text-xl text-gray-200"}>{(new Date(Number(token?.mintedDate)*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Maturity Date: </li>
                            <li className={"text-xl text-gray-200"}>{(new Date(Number(token?.maturityDate)*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>
                    </div>

                    {validBlock}

                </li>
                <li>
                    <div className={"mt-30"}>
                        <button className={"border-1 border-solid bg-black/30 text-white font-bold py-4 px-8 rounded-full"} >
                            Unlisted Token
                        </button>
                    </div>                    
                </li>
            </ul>
        </div>
        );

        return (
        
        <div>
            <OpaqueBox inside={stuff} />
        </div>      
     );
    }
    
}