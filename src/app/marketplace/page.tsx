'use client'

import ListingCard from "./ListingCard";
import { useRouter } from 'next/navigation';
import {useState, useEffect} from 'react';
import { useAccountStore, AccountInfo } from "../store/accountStore";
import { checkConnection } from "../blockchain/search";

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
        return(
            <div className={"flex justify-center mt-30"}>
                <button onClick={() => checkConnection} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                    Connect to MetaMask
                </button>
            </div>
            
        );        
    }

    return (
        <main>
            <div className={"flex flex-row align-center justify-evenly mt-7"}>
                <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"}onClick={() => handleClick("/list-token/")}>
                    List Token
                </button>
                <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-full"} onClick={() => handleClick("/delist-token/")}>
                    Delist Token
                </button>
            </div>
            <div className = {"flex flex-col mt-7"}>
                <ListingCard/>
            </div>
        </main>
        
    )
}