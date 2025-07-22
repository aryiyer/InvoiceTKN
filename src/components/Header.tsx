'use client'

import styles from  "./Header.module.css";

export default function Header() {
    return (
        <header className={styles.Header + " h-[49px] md:h-[60px] bg-teal-200"}>
           <h1 className={"text-lg text-black"}>Tradeable Invoice Token</h1> 
        </header>
    );
}