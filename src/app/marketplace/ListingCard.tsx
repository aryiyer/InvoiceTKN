'use client'

import { useRouter } from 'next/navigation';
import {useTokenStore} from "../store/dataStore";
import {useEffect, useState} from "react";
import styles from "./ListingCard.module.css";
import {getListed} from "../blockchain/search";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};


export default function ListingCard() {
    const [data, setData] = useState<any[]>([]); //sets the current state of data to be an empty array
    const [loading, setLoading] = useState(true); //sets the current state of loading to be true
    const setSelectedToken = useTokenStore((state) => state.setSelectedToken);
    const rout = useRouter();
        
    function handleClick(url: string, token: any) {
        setSelectedToken(token);
        rout.push(url);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const listed = await getListed();
                setData(listed);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    if(loading){
        return <div>Loading...</div>
    }


    return (
        <>
            {data.map(function(t, i){
                const IconNameBox = (
                <div className = {"flex flex-col justify-evenly"}>
                    <div>Icon here!</div>
                    <div>{t.info}</div>
                </div>
                );       

                const ValueBox = (<div>{t.value}</div>);
                const DateBox = (<div>{(new Date(t.maturityDate*1000)).toLocaleDateString(undefined, options)}</div>);
                const YieldBox = (<div>{t.yield}</div>);
                const PriceBox = (<div>Price here!</div>);
                const url = "/token/" + t.tokenId;
                //change MoreInfoBox to a button that redirects to the moreinfo page while passing t as a prop
                //const MoreInfoBox = (<div><a href={url} className={"text-blue-600"}>More Info</a></div>);

                const MoreInfoBox = (
                <div>
                    <button className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"} onClick={() => handleClick(url, t)}>
                        More Info
                    </button>
                </div>);

                return (
                    <div key={i} className = {styles.BigBox}>
                        <ul className = {"flex flex-row justify-evenly"}>
                            <li>{IconNameBox}</li>
                            <li>{ValueBox}</li>
                            <li>{DateBox}</li>
                            <li>{YieldBox}</li>
                            <li>{PriceBox}</li>
                            <li>{MoreInfoBox}</li>
                        </ul>  
                    </div>
                );
            })}
        </>
    );
}