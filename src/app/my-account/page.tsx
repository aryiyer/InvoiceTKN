'use client'

import {useAccountStore, AccountInfo} from '../store/accountStore';
import {useState, useEffect} from 'react';
import { getTokensOwned2, getMinted2, getTokensListed2, checkConnection } from '../blockchain/search';
import OpaqueBox from "../../components/Box";

export default function Dashboard() {
    const [ownedData, setOwnedData] = useState<Number[]>([]);
    const [mintedData, setMintedData] = useState<Number[]>([]);
    const [listedData, setListedData] = useState<Number[]>([]);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    const storedAccountInfo = useAccountStore((state) => state.currentAccountInfo);

    async function tokensListed(allOwned: Number[]) {
        const listed: Number[] = await getTokensListed2(allOwned);
        setListedData(listed);
    }

    useEffect(() => {
        async function getData(){
            await checkConnection(storedAccountInfo, setAccountInfo); //sets the account in state
            //get page-necessary data using account
            const owned: Number[] = await getTokensOwned2(String(storedAccountInfo?.accountAddress));
            setOwnedData(owned);
            const minted: Number[] = await getMinted2(String(storedAccountInfo?.accountAddress));
            setMintedData(minted);
            tokensListed(owned);
        }

        getData();

    }, []);


    if (!storedAccountInfo) {
        return(
            <div className={"flex justify-center mt-30"}>
                <button onClick={() => checkConnection(storedAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
            
        );
    }     

    else {
        const contents = (
        <div>
            <ul className={"flex flex-row ml-15 gap-4 items-center"}>
                    <li className={"text-xl text-white font-bold"}>Your Public Address: </li>
                    <li className={"text-xl text-gray-200"}>{storedAccountInfo?.accountAddress}</li>
            </ul>
            <ul className={"flex flex-row mt-7 ml-15 gap-4 items-center"}>
                <li className={"text-xl text-white font-bold"}>Account Role: </li>
                <li className={"text-xl text-gray-200"}>{storedAccountInfo?.accountType}</li>
            </ul>

            <ul className={"flex flex-row mt-15"}>

                <li>
                    <ul className={"flex flex-col mt-20 ml-15 gap-4 items-left"}>
                        <li className={"text-xl text-white font-bold"}>Tokens Owned: </li>
                        {ownedData.map((id: Number, i) => {
                            return(
                                <li key={i} className={"text-xl text-gray-200"}>
                                    <a className={"hover:text-gray-500"} href={"/token/"+String(id)}>#{String(id)}</a>
                                </li>)
                        })}
                    </ul>
                </li>

                <li>
                    <ul className={"flex flex-col mt-20 ml-15 gap-4 items-left"}>
                        <li className={"text-xl text-white font-bold"}>Tokens Minted: </li>
                        {mintedData.map((id: Number, i) => {
                            return(
                                <li key={i} className={"text-xl text-gray-200"}>
                                    <a className={"hover:text-gray-500"} href={"/token/"+String(id)}>#{String(id)}</a>
                                </li>)
                        })}
                    </ul>
                </li>

                <li>
                    <ul className={"flex flex-col mt-20 ml-15 gap-4 items-left"}>
                        <li className={"text-xl text-white font-bold"}>Tokens Listed: </li>
                        {listedData.map((id: Number, i) => {
                            return(
                                <li key={i} className={"text-xl text-gray-200"}>
                                    <a className={"hover:text-gray-500"} href={"/token/"+String(id)}>#{String(id)}</a>
                                </li>)
                        })}
                    </ul>
                </li>

            </ul>
        </div>
        );
        return (
            <OpaqueBox inside={contents} />
            );
    }
}