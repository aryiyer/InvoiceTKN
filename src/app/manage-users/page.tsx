'use client'

import {useState, useEffect} from 'react';
import { useAccountStore } from '../store/accountStore';
import { checkConnection } from '../blockchain/search';
import {addUser, changeUserRole, deleteUser} from '../blockchain/write';

export default function() {
    const [addMessage, setAddMessage] = useState<String>("");
    const [changeMessage, setChangeMessage] = useState<String>("");
    const [delMessage, setDelMessage] = useState<String>("");
    const currentAccountInfo = useAccountStore((state) => state.currentAccountInfo);
    const setAccountInfo = useAccountStore((state) => state.setAccountInfo);
    
    //only should display if accountType is owner

    async function resetMessages(){
        setAddMessage("");
        setChangeMessage("");
        setDelMessage("");
    }

    async function addUserClicked(formData: FormData) {
        await resetMessages()   
        const res = await addUser(String(formData.get("address")).toLowerCase(), String(formData.get("role")).toLowerCase(), currentAccountInfo?.accountAddress);
        setAddMessage(res);
    }

    async function changeClicked(formData: FormData) {       
        await resetMessages()         
        const res = await changeUserRole(String(formData.get("address")), String(formData.get("role")).toLowerCase(), currentAccountInfo?.accountAddress);        
        setChangeMessage(res);
    }

    async function deleteClicked(formData: FormData) {
        await resetMessages()
        const res = await deleteUser(String(formData.get("address")), currentAccountInfo?.accountAddress);        
        setDelMessage(res);
    }

    //else, display error.

    useEffect(()=> {
        async function init(){
            checkConnection(currentAccountInfo, setAccountInfo);
        }

        init();
    }, [])

    if (currentAccountInfo?.accountType != "owner") {
        return(
            <div className={"flex flex-col max-w-full mt-20 ml-15 gap-4 items-center"}>
                <div className={"text-xl font-bold"}>
                    Only owners of the contract can manage users.
                </div>

                <div>
                    <ul className={"flex flex-row mt-7"}>
                        <li className={"text-xl font-bold"}>Your Public Address: &nbsp;</li>
                        <li className={"text-xl text-gray-700"}>{currentAccountInfo?.accountAddress}</li>
                    </ul>           
                </div>
            </div>
        );
    } else {
       return(
            <div className={"flex flex-col max-w-full mt-20 gap-4 items-center"}>
                <div>
                    <ul className={"flex flex-row mt-7"}>
                        <li className={"text-xl font-bold"}>Welcome, &nbsp;</li>
                        <li className={"text-xl text-gray-700"}>{currentAccountInfo?.accountAddress}</li>
                    </ul>
                    <ul className={"flex flex-row mt-5"}>
                        <li className={"text-xl font-bold"}>Role: &nbsp;</li>
                        <li className={"text-xl text-gray-700"}>{currentAccountInfo?.accountType}</li>
                    </ul>               
                </div>


                <div className={"flex flex-row max-w-full mt-20 gap-x-6"}>
                    <form action={addUserClicked} className={"flex flex-col align-center mt-20"}>
                        <div className={"flex flex-col align-center"}>
                            <div>
                                <label htmlFor="address">Enter User Address: </label>
                                <input type="text" id="address" name="address" className={"border-1 border-solid border-black rounded-sm"}></input>
                            </div>
                            <div className={"mt-7"}>
                                <label htmlFor="role">Enter User Role: </label>
                                <select id="role" name="role" className={"border-1 border-solid border-black rounded-sm"}>
                                    <option>Minter</option>
                                    <option>Investor</option>
                                    <option>Owner</option>
                                </select>    
                            </div>         
                            <div className={"mt-7"}>
                                <button type="submit" className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                Add User
                                </button>
                            </div>
                            <div className={"mt-7"}>
                                {addMessage}
                            </div>                        
                        </div>
                    </form>

                    <form action={changeClicked} className={"flex flex-col align-center ml-15 mt-20"}>
                        <div className={"flex flex-col align-center"}>
                            <div>
                                <label htmlFor="address">Enter User Address: </label>
                                <input type="text" id="address" name="address" className={"border-1 border-solid border-black rounded-sm"}></input>
                            </div>
                            <div className={"mt-7"}>
                                <label htmlFor="role">Enter New Role: </label>
                                <select id="role" name="role" className={"border-1 border-solid border-black rounded-sm"}>
                                    <option>Minter</option>
                                    <option>Investor</option>
                                    <option>Owner</option>
                                </select>    
                            </div>         
                            <div className={"mt-7"}>
                                <button type="submit" className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                Change User Role
                                </button>
                            </div>

                            <div className={"mt-7"}>
                                {changeMessage}
                            </div>                          
                        </div>
                    </form>

                    <form action={deleteClicked} className={"flex flex-col align-center ml-15 mt-20"}>
                        <div className={"flex flex-col align-center"}>
                            <div>
                                <label htmlFor="address">Enter User Address: </label>
                                <input type="text" id="address" name="address" className={"border-1 border-solid border-black rounded-sm"}></input>
                            </div>
     
                            <div className={"mt-7"}>
                                <button type="submit" className={"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-full"} >
                                Delete User
                                </button>
                            </div>

                            <div className={"mt-7"}>
                                {delMessage}
                            </div>                         
                        </div>
                    </form>
                </div>
            </div>
        ); 
    }
}