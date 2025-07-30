'use client'


import {usePathname} from 'next/navigation';
import {useState, useEffect} from 'react';
import {isListed2, getTokInfo2, checkConnection, listingPrice, getAccountBalance, ownerOfToken, weiToEth} from '../../blockchain/search';
import { buyTokenPayable } from '@/app/blockchain/write';
import {useTokenStore, TokenData2} from "../../store/dataStore";
import { useAccountStore } from "../../store/accountStore";
import {useRouter} from "next/navigation";

declare var window: any;

export default function (){
    const [loading, setLoading] = useState<boolean>(true);
    const [listed, setListed] = useState();
    const [listPrice, setListPrice] = useState(); //listPrice in wei
    const [errorMessage, setMessage] = useState("");
    const [token, setToken] = useState<TokenData2 | null>(null);
    const rout = useRouter();

    //retrieve account info from store
    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);

    //check pathname to see that token is listed
    const tokenId = Number(usePathname().substring(16));

    //retrieve token info from store
    const storedToken = useTokenStore((state) => state.selectedToken);

    async function purchaseClicked(){
        setLoading(true);
        //check balance of user
        const bal = await getAccountBalance(String(currentAccountInfo?.accountAddress));
        console.log("user bal", bal);
        console.log("token price", Number(listPrice));
        //check that balance of user equals or exceeds token
        if (Number(listPrice) > bal){
            setLoading(false);
            setMessage("User balance is not enough for transaction!");
        } else {
            console.log("User balance is sufficient for transaction.");
            //attempt to call buyToken method
            console.log("list price:", listPrice);
            const tokOwner = String(await ownerOfToken(tokenId)).toLowerCase();
            const curr = String(currentAccountInfo?.accountAddress).toLowerCase();
            if (curr === tokOwner){
                setLoading(false);
                setMessage("Cannot purchase your own token!");
            } else {
                console.log("gurt");
                await buyTokenPayable(tokenId, tokOwner, String(currentAccountInfo?.accountAddress), Number(listPrice));
                rout.push("/my-account/");
            }
        }
    }

    useEffect(() => {
        async function init(){
            checkConnection(currentAccountInfo, setAccountInfo);            
            if (!storedToken){
                setToken(await getTokInfo2(tokenId));
            } else {
                setToken(storedToken);
            }
            const isListed = await isListed2(tokenId)
            setListed(isListed);
            if (isListed){
                setListPrice(await listingPrice(tokenId));
            }
            setLoading(false);
        }
        init();

    }, []);

    if (loading){
        return(
            <div className={"flex items-center justify-center min-h-screen"}>Loading...</div>
        );
    }

    if (!listed){
        return(
            <div className={"ml-15 mt-20"}>
                <div className={"text-xl font-bold text-red-500"}>Token is not listed!</div>                       
            </div>
        );
    }


    if (!currentAccountInfo){
        return(
            <div className={"flex justify-center mt-30"}>
                <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
            
        );
    }

    if (!(currentAccountInfo?.accountType == "investor" || currentAccountInfo?.accountType == "owner")) {
        return(
            <div className={"ml-15 mt-20"}>
                <div className={"text-xl font-bold text-red-500"}>Invalid User Role!</div>
                <div className={"text-xl text-red-500"}>Required: investor or owner.</div>
                <ul className={"flex flex-row gap-4 mt-7 items-center"}>
                    <li className={"text-xl font-bold"}>Your Public Address: </li>
                    <li className={"text-xl text-gray-700"}>{currentAccountInfo.accountAddress}</li>
                </ul>
                <ul className={"flex flex-row gap-4 mt-7 items-center"}>
                    <li className={"text-xl font-bold"}>Account Role: </li>
                    <li className={"text-xl text-gray-700"}>{currentAccountInfo.accountType}</li>
                </ul>               
            </div>
        );      
    }

    return (
        <div className={"ml-15"}>
            <ul className={"flex flex-row mt-20 gap-4 items-center"}>
                <li className={"text-xl font-bold"}>Your Public Address: </li>
                <li className={"text-xl text-gray-700"}>{currentAccountInfo.accountAddress}</li>
            </ul>

            <ul className={"flex flex-row mt-10 gap-4 items-center"}>
                <li className={"text-3xl"}>{token?.name}</li>
                <li className={"text-xl text-gray-500"}>id: #{token?.tokenId}</li>
            </ul>

            <ul className={"flex flex-row mt-10 gap-4"}>
                <li className={"text-2xl font-bold"}>Token Final Value:</li>
                <div>
                    <li className={"text-3xl"}>{weiToEth(Math.floor(Number(token?.value)*(1+Number(token?.yield)/10000)))} ETH</li>
                    <li className={"text-xl text-gray-500"}>Invoice Value: {weiToEth((Number(token?.value)))} ETH, Yield: {Number(token?.yield)/100}%</li>
                </div>
            </ul>

            <ul className={"flex flex-row mt-7 gap-4 items-center"}>
                <li className={"text-2xl"}>Token Price:</li>
                <li className={"text-3xl"}>{weiToEth(Number(listPrice))} ETH</li>
            </ul>
            
            <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mt-10"} onClick={purchaseClicked}>
                Purchase
            </button>

            <div className="text-l text-red-500 mt-3">
                    {errorMessage}
            </div>
        </div>
    );

    

    
}