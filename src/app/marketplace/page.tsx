'use client'

import ListingCard from "./ListingCard";
import { useRouter } from 'next/navigation';
import {useState, useEffect} from 'react';
import { useAccountStore, AccountInfo } from "../store/accountStore";
import { checkConnection } from "../blockchain/search";
import OpaqueBox from "@/components/Box";

export default function marketPlace() {
    const rout = useRouter();

    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    

    useEffect(() => {
        checkConnection(currentAccountInfo, setAccountInfo);
    }, []);

    function handleClick(url: string) {
        rout.push(url);
    };

    //if no account found in state
    if (!currentAccountInfo){
        const stuff = (
            <div className={"flex justify-center mt-30"}>
                <button onClick={() => checkConnection} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
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
    if (!(currentAccountInfo?.accountType == "minter" || currentAccountInfo?.accountType == "investor" || currentAccountInfo?.accountType == "owner")) {
        const stuff = (
            <div className = {"flex flex-col mt-7"}>
                <ListingCard/>
            </div>
        );
        
        return (
            <div>
                <OpaqueBox inside={stuff} />
            </div>
        );        
    } else {
        const stuff = (
            <div>
                <div className={"flex flex-row align-center justify-evenly mt-7"}>
                    <button className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-xl text-white font-bold py-4 px-8 rounded-full"}onClick={() => handleClick("/list-token/")}>
                        List Token
                    </button>
                    <button className={"border-1 border-solid bg-black/30 hover:bg-teal-700 text-xl text-white font-bold py-4 px-8 rounded-full"} onClick={() => handleClick("/delist-token/")}>
                        Delist Token
                    </button>
                </div>
                <div className = {"flex flex-col text-white mt-7"}>
                    <ListingCard/>
                </div>
            </div>
        );
        return (
            <div>
                <OpaqueBox inside={stuff}/>
            </div>            
        )
    }
}