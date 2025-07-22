'use client'


import {usePathname} from 'next/navigation';
import {useState, useEffect} from 'react';
import {getMMAccounts, isListed2, getTokInfo2} from '../../blockchain/search';
import {useTokenStore, TokenData2} from "../../store/dataStore";

declare var window: any;

export default function (){
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState("Connect to MetaMask");
    const [haveError, setError] = useState(false);    
    const [loading, setLoading] = useState<boolean>(true);
    const [listed, setListed] = useState<boolean>(true);
    const [token, setToken] = useState<TokenData2 | null>(null);

    //check pathname to see that token is listed
    const pathname = usePathname(); // /purchase-token/{id}
    const tokenId = Number(pathname.substring(16));

    const storedToken = useTokenStore((state) => state.selectedToken);
    
    async function checkListed(tokenId: number){
        try {
            const listed :boolean = await isListed2(tokenId);
            if (listed) {
                setListed(true);
            } else {
                setListed(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function checkConnection(){
        try {
            const account = await getMMAccounts();
            console.log(account);
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
            });
            setConnected(true);
            setAccount(account);

        } catch (error) {
            console.log("Error connecting to MM!");
        }
    }

    useEffect(() => {
        async function doChecks() {
            checkListed(tokenId);
            checkConnection();
            if (!storedToken){
                //no token found in state, need to load from blockchain
                try {
                    const t : (TokenData2 | null) = await getTokInfo2(tokenId);
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
                    setLoading(false);
                    setError(true);
                }
            } else {
                console.log("token info found in state.");
                setToken(storedToken);
                setLoading(false);
            }
        }

        doChecks();
    }, []);

    if (loading){
        return(
            <div>Loading...</div>
        );
    }

    if (haveError){
        return(
            <div>Errorrrorror</div>
        );
    }
    
    if (!listed) {
        return (
            <div>Token {tokenId} is not for sale!</div>
        );
    }

    if (!connected) {
        return(
            <div className={"flex justify-center mt-30"}>
                <button onClick={checkConnection} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
        );        
    }

    return (
        <div className={"ml-15"}>
            <ul className={"flex flex-row mt-20 gap-4 items-center"}>
                <li className={"text-xl font-bold"}>Your Public Address: </li>
                <li className={"text-xl text-gray-700"}>{account}</li>
            </ul>

            <ul className={"flex flex-row mt-10 gap-4 items-center"}>
                <li className={"text-3xl"}>{token?.name}</li>
                <li className={"text-xl text-gray-500"}>id: #{token?.tokenId}</li>
            </ul>

            <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mt-10"}>
                Purchase
            </button>
        </div>
    );

    

    
}