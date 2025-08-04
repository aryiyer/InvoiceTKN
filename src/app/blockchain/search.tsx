const { Web3 } = require('web3');
import {TokenData2} from "../store/dataStore";
const web3 = new Web3(process.env.NEXT_PUBLIC_SEPOLIA_API);
//const web3 = new Web3("https://sepolia.infura.io/v3/282bf43ad4b242228606d1202043127b");
import {MetaMaskSDK} from "@metamask/sdk";
import { AccountInfo } from "../store/accountStore";
import { marketplace_abi, marketplaceAddress, nft_abi, nftAddress } from "./nft_abi";

declare var window: any;

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Tradeable Invoice TKN",
    url: window.location.href,
  },
  infuraAPIKey: process.env.SEPOLIA_API,
});



const nftContract = new web3.eth.Contract(nft_abi, nftAddress);
const marketplaceContract = new web3.eth.Contract(marketplace_abi, marketplaceAddress);

export async function checkConnection(currentAccountInfo: AccountInfo | null, setAccountInfo: (info: AccountInfo) => void){
	//if no account found in state
	if (!currentAccountInfo) {
		console.log("account not found in state");
		//try to get from MM
		try {
			const account = await getMMAccounts();
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
			});

			//set state once account retrieved
			const role = await userRole(account);
			console.log(account);
			console.log(role);
			const info: AccountInfo = {
				accountAddress: account,
				accountType: role,
			}
			setAccountInfo(info);                
		} catch (error) {
			console.log("Error connected to MM.");
			console.error(error);
		}
	} else {
		//make sure that the account in state matches the MM account.
		console.log("account found in state");
		const account = await getMMAccounts();
		if (currentAccountInfo.accountAddress != account){
			const role = await userRole(String(account));
			const info: AccountInfo = {
				accountAddress: account,
				accountType: role,
			}
			setAccountInfo(info); 
		}
	}	
}

export async function userRole(address: string){
	console.log("Web3: Calling userRole.");
	try {
		const role = await nftContract.methods.getRole(address).call();
		return role;
	} catch (error) {
		console.error(error);
	}
}

export async function getMMAccounts(){
	const accounts = await MMSDK.connect();
	return accounts[0];
}

export async function getAccountBalance(account: string){
	await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
			});
	const result = await window.ethereum.request({
		"method": "eth_getBalance",
		"params": [
			account,
			"latest"
		],
	});	
	//return result in wei
	return Number(result);
}

export async function getListed2(){
	console.log("Web3: Called getListed2");
	try {
		const listedTokens = await marketplaceContract.methods.getListedItems().call();
		var ListedInfo: TokenData2[] = [];
		for (let i = 0; i < listedTokens.length; i++){
            let tokenId = Number(listedTokens[i]);
			console.log(tokenId);
			if (tokenId != 0) {
				let result = await nftContract.methods.getTokenInfo(tokenId).call();
				var data : TokenData2 = {
					tokenId: Number(result.tokenId),
					yield: Number(result.yield),
					mintedDate: Number(result.mintedDate),
					minter: String(result.minter),
					valid: Boolean(result.valid),
					name: String(result.name),
					value: Number(result.value), //in wei
					customer: String(result.customer),
					port: String(result.port),
					vesselName: String(result.vesselName),
					bunkerQuantity: Number(result.bunkerQuantity),
					bunkerPrice: Number(result.bunkerPrice),		
					maturityDate: Number(result.maturityDate),			
				}
				if (data.valid){
					ListedInfo.push(data);
				}
			}
        }
	   return Array.from(ListedInfo);
	} catch (error) {
		console.log("tried in search.tsx error");
		console.error(error);
		return ([]);
	}	
}

//return listing price in WEI
export async function listingPrice(tokenId: number){
	console.log("Web3: Calling listingPrice.");
	try {
		const price = await marketplaceContract.methods.getListingPrice(tokenId).call();
		return price;
	} catch (error) {
		console.error(error);
	}
}

export async function listingInfo(tokenId: number){
	console.log("Web3: Calling listingInfo.");
	try {
		const result = await marketplaceContract.methods.getListingInfo(tokenId).call();
		var listing = {
			tokenId: result.tokenId,
			price: result.price,
			listed: result.listed,
			seller: result.seller,
		};
		return listing;
	} catch (error) {
		console.error(error);
	}
}

export async function getMinted2(address: string){
	console.log("Web3: Called getMinted2", address);
	try {
		const result = await nftContract.methods.getMintedTokens(address).call();
		const idArr = result.map((id: any) => Number(id));
		return idArr;
	} catch (error) {
		console.error("getMinted2 error:", error);
		return [];
	}
}

export async function getTokInfo2(tokenId: Number){
	console.log("Web3: Called getTokInfo2");
	try {
        let result = await nftContract.methods.getTokenInfo(tokenId).call();
		var data : TokenData2 = {
			tokenId: Number(result.tokenId),
			yield: Number(result.yield),
			mintedDate: Number(result.mintedDate),
			minter: String(result.minter),
			valid: Boolean(result.valid),
			name: String(result.name),
			value: Number(result.value), //in wei
			customer: String(result.customer),
			port: String(result.port),
			vesselName: String(result.vesselName),
			bunkerQuantity: Number(result.bunkerQuantity),
			bunkerPrice: Number(result.bunkerPrice),		
			maturityDate: Number(result.maturityDate),			
		}
		return data;
    } catch (error) {
        console.error(error);
		throw new Error("getTokInfo2 failed")
    }
}

export async function getTokInfo3(tokenId: Number){
	console.log("Web3: Called getTokInfo3");
	try {
        let result = await nftContract.methods.getTokenInfo(tokenId).call();
		
		return result;
    } catch (error) {
        console.error(error);
		throw new Error("getTokInfo3 failed")
    }
}

export async function getTokensOwned2(address: string){
	console.log("Web3: Called getTokensOwned2");
	try {
		const bal = await nftContract.methods.balanceOf(address).call();
		const ret : Number[] = [];
		for (let i = 0; i < bal; i++){
			ret.push(Number(await nftContract.methods.tokenOfOwnerByIndex(address, i).call()));
		}
		return ret;
	} catch (error) {		
		console.error(error);
		return [];
	}
}

export async function getTokensListed2(allOwned: Number[]){
	console.log("Web3: Calling getTokensListed2.");
	try {
		const allListed: Number[] = [];
		for (let i = 0; i < allOwned.length; i++){
			var tokenId = allOwned[i];
			var listed = await marketplaceContract.methods.isListed(tokenId).call();
			if (listed){
				allListed.push(tokenId);
			}
		}
		return allListed;
	} catch (error) {
		console.log(error);
		return ([]);
	}
}

export async function getTokensNotListed2(allOwned: Number[]){
	console.log("Web3: Calling getTokensNotListed2.");
	try {
		const allNotListed: Number[] = [];
		for (let i = 0; i < allOwned.length; i++){
			var tokenId = allOwned[i];
			var listed = await marketplaceContract.methods.isListed(tokenId).call();
			if (!listed){
				allNotListed.push(tokenId);
			}
		}
		return allNotListed;
	} catch (error) {
		console.log(error);
		return ([]);
	}
}

export async function isListed2(tokenId: Number){
	console.log("Web3: Calling isListed.");
	try{
		const val = await marketplaceContract.methods.isListed(tokenId).call();
		return val;
	} catch (error) {
		console.error(error);
	}
}

export async function ownerOfToken(tokenId: number){
	console.log("Web3: Calling ownerOfToken");
	try {
		const addy = await nftContract.methods.ownerOf(tokenId).call();
		return addy;
	} catch (error){
		console.log(error);
	}
}

export function ethToWei(val : Number | String) {
	return (web3.utils.toWei(String(val), "ether"));
}

export function weiToEth(val : Number | String) {
	return (web3.utils.fromWei(String(val), "ether"));
}

export async function liveValue(tokenId: Number){
	//get minted and maturity stamps, calculate total maturity time in seconds
	//get current time, in seconds
	const token : TokenData2 = await getTokInfo2(tokenId);
	const mintedTime = token.mintedDate;
	const matureTime = token.maturityDate;

	const totalTime = matureTime - mintedTime;
	const currTime = Date.now()/1000; //in seconds
	const completion = (currTime-mintedTime)/totalTime;
	console.log("completion:", completion);

	const value = token.value
	const yieldd = token.yield/10000; //decimal
	
	const endValue = value*(yieldd); //in wei
	
	const currValue = (completion*endValue);
	const eth = Number(weiToEth(Math.floor(currValue+value)));
	return(eth.toFixed(8));
}

export async function totalValue(tokenId: Number){
	console.log("Web3: Calling total value");
	try {
		const res = await nftContract.methods.settleAmount(tokenId).call();
		return res;
	} catch (error) {
		console.error(error);
	}
}