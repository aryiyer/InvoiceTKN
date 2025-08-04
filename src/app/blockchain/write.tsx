const { Web3 } = require('web3');
import { marketplace_abi, marketplaceAddress, nft_abi, nftAddress } from "./nft_abi";
import { TokenData2 } from "../store/dataStore";
import { getTokInfo2, isListed2 } from "./search";

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

export async function mintTkn(name :string, minter: string, to : string, daysAfter: number, value : String, _yield : number) {
	console.log("Web3: Calling mintTkn.");
	const wei = Number(web3MM.utils.toWei(value, "ether"));
	console.log("wei val", wei);
	try {
		await nftContract.methods.mintToken(name, daysAfter, wei, _yield).send({
			from: minter,
		});
		console.log("Minted token.");
	} catch (error) {
		console.error(error);
	}
}

export async function mintTkn2(minter : string, inputData : any) {
	console.log("Web3: Calling mintTkn2.");
	const wei = Number(web3MM.utils.toWei(inputData.value, "ether"));
	inputData.value = wei;
	console.log("wei val", wei);
	try {
		await nftContract.methods.mintToken2(inputData).send({
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
		return("Added user!");
	} catch (error) {
		console.error(error);
		return("Failed to add user.");
	}
}

export async function changeUserRole(address: string, role: string, fromAddy: any) {
	console.log("Web3: Calling changeUserRole.");
	try {
		await nftContract.methods.changeRole(address, role).send({
			from: fromAddy,
		});
		console.log("Changed user role.");
		return("Changed user role.");
	} catch (error) {
		console.error(error);
		return("Failed to change user role.");
	}
}

export async function deleteUser(address: string, fromAddy : any) {
	console.log("Web3: Calling deleteUser.");
	try {
		await nftContract.methods.removeUser(address).send({
			from: fromAddy,
		});
		console.log("Deleted user.");
		return("Deleted user.");
	} catch (error) {
		console.error(error);
		return("Failed to delete user.");
	}
}

/* MARKETPLACE WRITE FUNCTIONS */

//lists token in gwei
export async function listCoin2(tokenId: number, price: number){
    const accounts = await web3MM.eth.requestAccounts();
    console.log("Web3: Calling listCoin2");
    try {
		const t : TokenData2 = await getTokInfo2(tokenId);
		if (!(t.valid)){
			throw new Error("Token is invalid and cannot be listed.");
		}
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

export async function delistCoin2(tokenId: Number){
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

//assumes that the user balance has been verified to have sufficient balance
//_value is in ETH, is converted into WEI for the transfer.
// export async function buyToken(tokenId: number, sellerAcc: string, buyerAcc: string, _value: String){
// 	console.log("Web3: Calling buyToken");
// 	try {
// 		const accounts = await web3MM.eth.requestAccounts();
// 		const res = await transferTokens(buyerAcc, sellerAcc, _value); //transfers _value in (eth) from buyer to seller wallet.				
// 		if (res) {
// 			await marketplaceContract.methods.buyItem(nftAddress, tokenId, buyerAcc).send({
//             	from: accounts[0],
//         	});
// 		}
// 		console.log("gurt purchased");
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

export async function buyTokenPayable(tokenId: number, sellerAcc: string, buyerAcc: string, _value: Number) {
	console.log("Web3: Calling buyTokenPayable");
	try {
		const accounts = await web3MM.eth.requestAccounts();							
		await marketplaceContract.methods.buyItemP(nftAddress, tokenId, buyerAcc).send({
			from: accounts[0],
			value: _value,
		});
		
		console.log("gurt purchased");
	} catch (error) {
		console.error(error);
	}	
}

export async function transferTokens(_from : string, _to :string, amount: String) {
		console.log("Web3: calling transferTokens");
		//const wei = web3MM.utils.toWei(amount, "ether");
		const wei = amount;
		try {
			const hash = await web3MM.eth.sendTransaction({
				from: _from,
				to: _to,
				value: wei,
			});
			console.log("transferred, hash:", hash);
			return(true);
		} catch (error) {
			console.error("gurt error", error);
			return(false);
		}
}

//takes _value in wei
export async function settle(_from: string, tokenId : Number, _value: Number){
	console.log("Web3: Calling settle");
	try {
		var s = Date.now()/ 1000;
		const t:TokenData2 = await getTokInfo2(tokenId);
		if (!(s >= t.maturityDate-24*60*60)){
			return ("Failed, cannot settle more than 24 hours before maturity date.");
		}
		await nftContract.methods.settleToken(tokenId).send({
			from: _from,
			value: _value,
		});

		if (await isListed2(tokenId)){
			await delistCoin2(tokenId);
		};

		console.log("Settle success.");
		return ("Success");
	} catch (error) {
		console.error(error);
		return ("Failed.");
	}

	//add edits such that available tokens are affected by validity
}

