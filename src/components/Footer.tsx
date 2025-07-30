'use client'

import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className = {"flex items-center items-center fixed bottom-0 h-[49px] md:h-[60px] bg-black/70 w-full justify-end"}>
            <div className={"flex flex-row items-center gap-15 pr-10 opacity-100"}>
                <p className = {"text-white text-lg"}>2025</p>
                <p className = {"text-white text-lg"}>built by Ary</p>
                <a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrszdZ_e7hRWAAxtRaOKT93FAcjrNVyurWYA&s"
                className={"text-white text-lg"}> Frog </a>
            </div>

        </footer>
    )
}