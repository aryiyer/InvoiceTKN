'use client'

import { useRouter } from 'next/navigation';
import {useTokenStore} from "../store/dataStore";
import {useEffect, useState} from "react";
import styles from "./ListingCard.module.css";
import {getListed2, listingPrice, weiToEth} from "../blockchain/search";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
} as const;


export default function ListingCard() {
    const [data, setData] = useState<stuff[]>([]); //sets the current state of data to be an empty array
    const [loading, setLoading] = useState(true); //sets the current state of loading to be true
    const setSelectedToken = useTokenStore((state) => state.setSelectedToken);
    const rout = useRouter();
        
    function handleClick(url: string, token: any) {
        setSelectedToken(token);
        rout.push(url);
    };

    type stuff = {
        token: any,
        tokenPrice : Number
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const listed = await getListed2();
                var items : stuff[] = [];
                for (let i = 0; i < listed.length; i++){
                    const price = await listingPrice(listed[i].tokenId); //listing price is in WEI
                    const thing : stuff = {
                        token: listed[i],
                        tokenPrice: price
                    }
                    items.push(thing);
                }
                setData(items);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    if(loading){
        <div className={"flex items-center justify-center min-h-screen"}>Loading...</div>
    }


    return (
        <>
            <div className={styles.Header}>
                <ul>
                    <li>Name</li>
                    <li>Invoice Value</li>                            
                    <li>Yield</li>
                    <li>Token Price</li>
                    <li>Maturity Date</li>                            
                    
                </ul>  
            </div>

            {data.map(function(t, i){
                const IconNameBox = (<div>{t.token.name}</div>);       
                const ValueBox = (<div>{weiToEth(Number(t.token.value))} ETH</div>);
                const DateBox = (<div>{(new Date(t.token.maturityDate*1000)).toLocaleDateString(undefined, options)}</div>);
                const YieldBox = (<div>{t.token.yield/100}%</div>);
                const PriceBox = (<div>{weiToEth(Number(t.tokenPrice))} ETH</div>);
                const url = "/token/" + t.token.tokenId;
                const MoreInfoBox = (
                <div>
                    <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"} onClick={() => handleClick(url, t.token)}>
                        More Info
                    </button>
                </div>);

                return (
                    <div key={i} className = {styles.BigBox}>
                        <ul>
                            <li>{IconNameBox}</li>
                            <li>{ValueBox}</li>                            
                            <li>{YieldBox}</li>
                            <li>{PriceBox}</li>
                            <li>{DateBox}</li>
                            <li>{MoreInfoBox}</li>
                        </ul>  
                    </div>
                );
            })}
        </>
    );
}