'use client'

import styles from "./Navbar.module.css";
import { AccountInfo, useAccountStore } from "../app/store/accountStore";
import Butt from "./NavButton"

export default function Navbar() {
    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    
    

    if (!currentAccountInfo){
        return(
            <header className = {styles.Navbar + " bg-black/70"}>
                <ul className = {styles.NavbarUL}>
                </ul>
            </header>
        );
    } else if (currentAccountInfo.accountType == "minter") {
        var links = ["/", "/my-account", "/marketplace", "/mint-token", "/settle-token"];
        var strs = ["Home", "My Account", "Marketplace", "Mint Token", "Settle Token"];        
        return(
            <header className = {styles.Navbar + " bg-black/70"}>
                <div className={"ml-10 text-white text-4xl font-bold"}>
                    <a href="/">InvoiceTKN</a>                    
                </div>
                <Butt links={links} strs={strs}/>
            </header>
        );
    } else if (currentAccountInfo.accountType == "investor") {
        var links = ["/", "/my-account", "/marketplace"];
        var strs = ["Home", "My Account", "Marketplace"];   
        return (
            <header className = {styles.Navbar + " bg-black/70"}>
                <div className={"ml-10 text-white text-4xl font-bold"}>
                    <a href="/">InvoiceTKN</a>
                </div>
                <Butt links={links} strs={strs}/>
            </header>
        );
    } else if (currentAccountInfo.accountType == "owner") {
        var links = ["/", "/my-account", "/marketplace", "/mint-token", "/settle-token", "/manage-users"];
        var strs = ["Home", "My Account", "Marketplace", "Mint Token", "Settle Token", "Manage Users"];    
        return (
            <header className = {styles.Navbar + " bg-black/70"}>
                <div className={"ml-10 text-white text-4xl font-bold"}>
                    <a href="/">InvoiceTKN</a>
                </div>
                <Butt links={links} strs={strs}/>
            </header>
        );
    } else {
        var links = ["/", "/my-account", "/marketplace"];
        var strs = ["Home", "My Account", "Marketplace"];   
        return (
            <header className = {styles.Navbar + " bg-black/70"}>
                <div className={"ml-10 text-white text-4xl font-bold"}>
                    <a href="/">InvoiceTKN</a>
                </div>
                <Butt links={links} strs={strs}/>
            </header>
        );
    }
}
