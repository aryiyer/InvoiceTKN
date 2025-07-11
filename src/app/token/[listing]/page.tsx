'use client'

import {useState, useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {useTokenStore} from "../../store/dataStore";
import {TokenData} from "../../store/dataStore";
import {getTokInfo} from "../../blockchain/search";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  fractionalSecondDigits: "2",
};

export default function DynamicRoute(props: any){
    const [loading, setLoading] = useState(true);
    const [haveError, setError] = useState(false);
    const [token, setToken] = useState<TokenData | null>(null);

    const setSelectedToken = useTokenStore((state) => state.setSelectedToken);
    const rout = useRouter();
    
    const pathname = usePathname(); // /token/{id}/
    const tokenId = Number(pathname.substring(7));
    const storedToken = useTokenStore((state) => state.selectedToken);
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
                    const t : (TokenData | null) = await getTokInfo(tokenId);
                    if (t == null){
                        console.log("Error in getTokenInfo");
                        setLoading(false);
                        setError(true);
                    } else {
                        console.log("found tokenInfo from blockchain.");
                        setToken(t);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log("token found in state.")
                setToken(storedToken);
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    if (loading) {
        return(
            <div>Loading...</div>
        );
    }

    if (haveError) {
        return(
            <div>Error brah!</div>
        );
    }

    if (token?.listed){
        return (
        <div>
            <ul className={"flex flex-row items-center justify-evenly"}>
                <li>
                    <div className={"mt-30"}>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>{token.info}</li>
                            <li className={"text-xl text-gray-500"}>id: #{token.tokenId}</li>
                        </ul>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>${token.value}</li>
                            <li className={"text-xl text-gray-500"}>{(token.yield)/10}%</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted by: </li>
                            <li className={"text-xl text-gray-700"}>{token.minter}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Maturity Date: </li>
                            <li className={"text-xl text-gray-700"}>{(new Date(token.maturityDate*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div className={"mt-30"}>
                        <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"} onClick={() => handleClick(("/purchase-token/"+String(tokenId)), token)}>
                            Purchase
                        </button>
                    </div>                    
                </li>
            </ul>
        </div>        
    );
    } else {
        return (
        <div>
            <ul className={"flex flex-row items-center justify-evenly"}>
                <li>
                    <div className={"mt-30"}>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>{token.info}</li>
                            <li className={"text-xl text-gray-500"}>id: #{token.tokenId}</li>
                        </ul>
                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-3xl"}>${token?.value}</li>
                            <li className={"text-xl text-gray-500"}>{token.yield/10}%</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Minted by: </li>
                            <li className={"text-xl text-gray-700"}>{token?.minter}</li>
                        </ul>

                        <ul className={"flex flex-row mt-6 gap-4 items-center"}>
                            <li className={"text-xl font-bold"}>Maturity Date: </li>
                            <li className={"text-xl text-gray-700"}>{(new Date(token.maturityDate*1000)).toLocaleDateString(undefined, options)}</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div className={"mt-30"}>
                        <button className={"bg-gray-500 text-white font-bold py-4 px-8 rounded-full"} >
                            Unlisted Token
                        </button>
                    </div>                    
                </li>
            </ul>
        </div>      
     );
    }
    
}