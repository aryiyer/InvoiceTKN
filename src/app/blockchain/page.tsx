'use client'


import {MetaMaskSDK} from "@metamask/sdk";
import {senderAddress} from "./search";

import {getFirstCoin, getTokensOwned} from "./search";
import{purchaseCoinTemp} from "./write";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Tradeable Invoice TKN",
    url: window.location.href,
  },
  infuraAPIKey: process.env.SEPOLIA_API,
});

export default function DynamicRoute(){

    async function getAccounts(){
        const accounts = await MMSDK.connect();
        for(let i = 0; i < accounts.length; i++){
            console.log("Account " + i + ": " + accounts[i]);
        }
        return accounts[0];
    }

    async function handleClick(){
        console.log("clicked!!");
        
        await purchaseCoinTemp(1);
        
        console.log("finished handling click.");
    }

    return (
        <div>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"} onClick={handleClick}>
                Button
            </button>
        </div>
    );
//onClick={handleClick()}
}