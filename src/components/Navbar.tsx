'use client'

import styles from "./Navbar.module.css";
import { AccountInfo, useAccountStore } from "../app/store/accountStore";

export default function Navbar() {
    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    //console.log(currentAccountInfo?.accountType);

    if (!currentAccountInfo){
        return(
            <header className = {styles.Navbar + " bg-teal-500"}>
                <ul className = {styles.NavbarUL}>
                </ul>
            </header>
        );
    } else if (currentAccountInfo.accountType == "minter") {
        return(
            <header className = {styles.Navbar + " bg-teal-500"}>
                <ul className = {styles.NavbarUL}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/my-account">My Account</a></li>
                    <li><a href="/marketplace">Marketplace</a></li>
                    <li><a href="/mint-token">Mint Token</a></li>
                </ul>
            </header>
        );
    } else if (currentAccountInfo.accountType == "investor") {
        return (
            <header className = {styles.Navbar + " bg-teal-500"}>
                <ul className = {styles.NavbarUL}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/my-account">My Account</a></li>
                    <li><a href="/marketplace">Marketplace</a></li>
                </ul>
            </header>
        );
    } else if (currentAccountInfo.accountType == "owner") {
        return (
            <header className = {styles.Navbar + " bg-teal-500"}>
                <ul className = {styles.NavbarUL}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/my-account">My Account</a></li>
                    <li><a href="/marketplace">Marketplace</a></li>
                    <li><a href="/mint-token">Mint Token</a></li>
                    <li><a href="/manage-users">Manage Users</a></li>
                </ul>
            </header>
        );
    } else {
        return (
            <header className = {styles.Navbar + " bg-teal-500"}>
                <ul className = {styles.NavbarUL}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/my-account">My Account</a></li>
                    <li><a href="/marketplace">Marketplace</a></li>
                </ul>
            </header>
        );
    }
}
