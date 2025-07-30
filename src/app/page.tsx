'use client'

import { getMMAccounts, checkConnection } from './blockchain/search';
import {useState, useEffect} from 'react';
import { useAccountStore, AccountInfo } from './store/accountStore';
import OpaqueBox from '@/components/Box';

export default function Home() {
  const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
  const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);

  useEffect(() => {
    checkConnection(currentAccountInfo, setAccountInfo);
  }, []);

  if (!currentAccountInfo){
      return(
        <div className={"flex justify-center mt-30"}>
            <button onClick={() => checkConnection(currentAccountInfo, setAccountInfo)} className={"bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full"} >
                Connect to MetaMask
            </button>
        </div>
      );
  } else {
    return(
      <div>
        <div className={"text-7xl text-white mt-[7%] ml-[5%]"}>
          Tokenize Real World Invoices into NFTs.
        </div>


        <div className={"bg-black/50 pt-12 pb-12 mt-10 w-[80%] ml-[5%] rounded-xl"}>
            <div className={"flex flex-row text-5xl pl-[5%] "}>
              <div className={"text-teal-600"}>
                On-chain. &nbsp;
              </div>
              <div className={"text-teal-500"}>
                Permissioned. &nbsp;
              </div>
              <div className={"text-teal-400"}>
                Audited.
              </div>
                
            </div>
        </div>

      </div>
    );
  }

}
