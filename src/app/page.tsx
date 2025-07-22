'use client'

import { getMMAccounts, checkConnection } from './blockchain/search';
import {useState, useEffect} from 'react';
import { useAccountStore, AccountInfo } from './store/accountStore';

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
        <p>{currentAccountInfo.accountType} view!!</p>
        <p>Account Address: {currentAccountInfo.accountAddress}</p>
        <p>Account Type: {currentAccountInfo.accountType}</p>
      </div>
    )
  }

}
