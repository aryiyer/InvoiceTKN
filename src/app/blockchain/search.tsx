const { Web3 } = require('web3');
import {TokenData2} from "../store/dataStore";
const web3 = new Web3(process.env.NEXT_PUBLIC_SEPOLIA_API);
//const web3 = new Web3("https://sepolia.infura.io/v3/282bf43ad4b242228606d1202043127b");
import {MetaMaskSDK} from "@metamask/sdk";
import { AccountInfo } from "../store/dataStore";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Tradeable Invoice TKN",
    url: window.location.href,
  },
  infuraAPIKey: process.env.SEPOLIA_API,
});

declare var window: any;

const nft_abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ERC721EnumerableForbiddenBatchMint",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "ERC721OutOfBoundsIndex",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"name": "changeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "contains",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addy",
				"type": "address"
			}
		],
		"name": "getMintedTokens",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getMinter",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "addy",
				"type": "address"
			}
		],
		"name": "getRole",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getTokenInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "value",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "yield",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "valid",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "minter",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "maturityDate",
						"type": "uint256"
					}
				],
				"internalType": "struct InvoiceTKN2.tokenData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_minter",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "daysAfter",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_yield",
				"type": "uint256"
			}
		],
		"name": "mintToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newUser",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"name": "onboardUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "removeUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "v",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "setValidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const marketplace_abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "buyItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "delistItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getListedItems",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "getListingInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					}
				],
				"internalType": "struct ITKNMarketplace.Listing",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "getListingPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "isListed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC721",
				"name": "nftAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "updateListing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const nftAddress = "0x1c1110f49ae6693c8279285c62e374963b664e84";
const marketplaceAddress = "0xe942162eb3c53e1a510a59b9cf24d10dde00d3a0";

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

				//logic to convert seconds from epoch to date
				
				var data : TokenData2 = {
					tokenId: Number(result.tokenId),
					name: String(result.name),
					value: Number(result.value),
					yield: Number(result.yield),
					valid: Boolean(result.valid),
					minter: String(result.minter),
					maturityDate: Number(result.maturityDate),
				}
				ListedInfo.push(data);
			}
        }
	   return Array.from(ListedInfo);
	} catch (error) {
		console.log("tried in search.tsx error");
		console.error(error);
		return ([]);
	}	
}

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
	console.log("Web3: Called getMinted2 with address:", address);
	
	try {
		const result = await nftContract.methods.getMintedTokens(address).call();
		const idArr = result.map((id: any) => Number(id));
		return idArr;
	} catch (error) {
		console.error("getMinted2 error:", error);
		return [];
	}
}

export async function getTokInfo2(tokenId: number){
	console.log("Web3: Called getTokInfo2");
	try {
        let result = await nftContract.methods.getTokenInfo(tokenId).call();
		var data : TokenData2 = {
			tokenId: Number(result.tokenId),
			name: String(result.name),
			value: Number(result.value),
			yield: Number(result.yield),
			valid: Boolean(result.valid),
			minter: String(result.minter),
			maturityDate: Number(result.maturityDate),
		}
		return data;
    } catch (error) {
        console.error(error);
		return null;
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

export async function isListed2(tokenId: number){
	console.log("Web3: Calling isListed.");
	try{
		const val = await marketplaceContract.methods.isListed(tokenId).call();
		return val;
	} catch (error) {
		console.error(error);
	}
}