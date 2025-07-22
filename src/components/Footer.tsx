'use client'

import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className = {styles.Footer + "  h-[49px] md:h-[60px] bg-teal-200"}>
            <p className = {"text-black text-lg"}>2025</p>
            <p className = {"text-black text-lg"}>built by Ary</p>
            <a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrszdZ_e7hRWAAxtRaOKT93FAcjrNVyurWYA&s"
            className={"text-black text-leg"}> phrog </a>
        </footer>
    )
}