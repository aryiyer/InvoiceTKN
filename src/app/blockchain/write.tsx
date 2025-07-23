const { Web3 } = require('web3');
import { marketplace_abi, marketplaceAddress, nft_abi, nftAddress } from "./nft_abi";

import {MetaMaskSDK} from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Tradeable Invoice TKN",
    url: window.location.href,
  },
  infuraAPIKey: process.env.SEPOLIA_API,
});

declare var window: any
const web3MM = new Web3(window.ethereum);

const nftContract = new web3MM.eth.Contract(nft_abi, nftAddress);
const marketplaceContract = new web3MM.eth.Contract(marketplace_abi, marketplaceAddress);

/* NFT CONTRACT WRITE FUNCTIONS */

export async function mintTkn(name :string, minter: string, to : string, daysAfter: number, value : number, _yield : number) {
	console.log("Web3: Calling mintTkn.");
	try {
		await nftContract.methods.mintToken(name, minter, to, daysAfter, value, _yield).send({
			from: minter,
		});
		console.log("Minted token.");
	} catch (error) {
		console.error(error);
	}
}

export async function addUser(address: string, role: string, fromAddy: any) {
	console.log("Web3: Calling addUser.");
	try {
		await nftContract.methods.onboardUser(address, role).send({
			from: fromAddy,
		});
		
		console.log("Added user.");
	} catch (error) {
		console.error(error);
	}
}

export async function changeUserRole(address: string, role: string, fromAddy: any) {
	console.log("Web3: Calling changeUserRole.");
	try {
		await nftContract.methods.changeRole(address, role).send({
			from: fromAddy,
		});
		console.log("Changed user role.");
	} catch (error) {
		console.error(error);
	}
}

export async function deleteUser(address: string, fromAddy : any) {
	console.log("Web3: Calling deleteUser.");
	try {
		await nftContract.methods.removeUser(address).send({
			from: fromAddy,
		});
		console.log("Deleted user.");
	} catch (error) {
		console.error(error);
	}
}

/* MARKETPLACE WRITE FUNCTIONS */

export async function listCoin2(tokenId: number, price: number){
    const accounts = await web3MM.eth.requestAccounts();
    console.log("Web3: Calling listCoin2");
    try {
		await nftContract.methods.approve(marketplaceAddress, tokenId).send({
			from: accounts[0],
		});
        await marketplaceContract.methods.listItem(nftAddress, tokenId, price).send({
            from: accounts[0],
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function delistCoin2(tokenId: number){
    const accounts = await web3MM.eth.requestAccounts();
    console.log("Web3: Calling delistCoin2");
    try {
        await marketplaceContract.methods.delistItem(nftAddress, tokenId).send({
            from: accounts[0],
        });
        console.log("delisted");
    } catch (error) {
        console.error(error);
    }
}

//token being purchases, person purchasing.
//token being purchased should contain info on current owner and listing price.
//person purchasing should contain info on their address

//for now, purchase is free.
// export async function purchaseCoinTemp(tokenId: number){
//     console.log("Web3: Calling purchaseCoinTemp");
//     const accounts = await web3MM.eth.requestAccounts();
//     var ownerAccount;

//     //get owner of token being purchased
//     try {
//         ownerAccount = await contract.methods.ownerOf(tokenId).call();
//         console.log("Token owner: " + ownerAccount);
//         //check that purchaser has sufficient balance
//         var balance = await web3MM.eth.getBalance(accounts[0]);
//         balance = Number(balance)/1000000000000000000;
//         console.log(accounts[0] + "balance: "+ balance);
//         /*if (balance >= price)
//             try {
//                 transfer amount
//                 deListToken(tokenId)
//                 tranferToken(from, to, etc.);
//             } catch {error}
//         */

//     } catch (error) {
//         console.log("Error getting ownerOf token.");
//         console.error(error);
//     }
    
// }

