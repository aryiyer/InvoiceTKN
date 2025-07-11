const { Web3 } = require('web3');
import {TokenData} from "../store/dataStore";
const web3 = new Web3(process.env.NEXT_PUBLIC_SEPOLIA_API);
import {MetaMaskSDK} from "@metamask/sdk";
import { AccountInfo } from "../store/dataStore";



const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Tradeable Invoice TKN",
    url: window.location.href,
  },
  infuraAPIKey: process.env.SEPOLIA_API,
});

const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": false,
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
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
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
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "delistCoin",
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
		"name": "listCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "strInfo",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_minter",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
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
		"name": "mintCoin",
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
				"name": "_approved",
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
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "settleCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
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
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
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
		"inputs": [],
		"name": "currentTokenId",
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
		"inputs": [],
		"name": "getListedTokens",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "acc",
				"type": "address"
			}
		],
		"name": "getOwning",
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
		"inputs": [],
		"name": "getSenderAddress",
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
		"name": "getSupply",
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
		"inputs": [],
		"name": "getTimeStamp",
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
						"name": "info",
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
						"internalType": "address[]",
						"name": "ownerHistory",
						"type": "address[]"
					},
					{
						"internalType": "bool",
						"name": "valid",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "minter",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "approved",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "maturityDate",
						"type": "uint256"
					}
				],
				"internalType": "struct InvoiceTKN.tokenData",
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
				"name": "ownerAcc",
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
				"internalType": "uint256",
				"name": "tokenId",
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
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "isValid",
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
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "secondsUntilMaturity",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);

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
			const info: AccountInfo = {
				accountAddress: account,
				accountType: "minter",
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
			const info: AccountInfo = {
				accountAddress: account,
				accountType: "minter",
			}
			setAccountInfo(info); 
		}
	}	
}

export async function getMMAccounts(){
	const accounts = await MMSDK.connect();
	// for(let i = 0; i < accounts.length; i++){
	// 	console.log("Account " + i + ": " + accounts[i]);
	// }
	return accounts[0];
}

export async function getListed(){
	console.log("Web3: Called getListed");
	try {
		const listedTokens = await contract.methods.getListedTokens().call();
		var ListedInfo: TokenData[] = [];
		for (let i = 0; i < listedTokens.length; i++){
            let tokenId = Number(listedTokens[i]);
			if (tokenId != 0) {
				let result = await contract.methods.getTokenInfo(tokenId).call();

				//logic to convert seconds from epoch to date
				
				var data : TokenData = {
					tokenId: Number(result.tokenId),
					info: String(result.info),
					value: Number(result.value),
					yield: Number(result.yield),
					ownerHistory: Array.from(result.ownerHistory),
					valid: Boolean(result.valid),
					listed: Boolean(result.listed),
					minter: String(result.minter),
					approved: String(result.approved),
					maturityDate: Number(result.maturityDate),
				}
				ListedInfo.push(data);
			}
        }
	   return Array.from(ListedInfo);
	} catch (error) {
		console.log("tried in search.tsx error");
		console.error(error);
	}
}

export async function getMinted(address: string){
	console.log("Web3: Called getMinted.");
	try{
		const result = await contract.methods.getMintedTokens(address).call();
		const idArr = result.map((id: any) => {
			return (Number(id));
		});
		return idArr;
	} catch (error) {
		console.error(error);
	}

}

export async function getTokInfo(tokenId: number){
	console.log("Web3: Called getTokInfo");
	try {
        let result = await contract.methods.getTokenInfo(tokenId).call();
		var data : TokenData = {
			tokenId: Number(result.tokenId),
			info: String(result.info),
			value: Number(result.value),
			yield: Number(result.yield),
			ownerHistory: Array.from(result.ownerHistory),
			valid: Boolean(result.valid),
			listed: Boolean(result.listed),
			minter: String(result.minter),
			approved: String(result.approved),
			maturityDate: Number(result.maturityDate),
		}
		return data;
    } catch (error) {
        console.error(error);
		return null;
    }
}

export async function getTokensOwned(address: string){
	console.log("Web3: Called getTokensOwned");
	try {
		const result = await contract.methods.getOwning(address).call();
		const idArr = result.map((id: any) => {
			return (Number(id));
		});
		return idArr;
	} catch (error) {
		console.error(error);
	}
	
}

export async function getTokensListed(allOwned: Number[]){
	console.log("Web3: Calling getTokensListed.");
	try {
		const allListed: Number[] = [];
		for (let i = 0; i < allOwned.length; i++){
			var tokenId = Number(allOwned[i]);
			var listed = await contract.methods.isListed(tokenId).call();
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

export async function getTokensNotListed(allOwned: Number[]){
	console.log("Web3: Calling getTokensListed.");
	try {
		const allListed: Number[] = [];
		for (let i = 0; i < allOwned.length; i++){
			var tokenId = Number(allOwned[i]);
			var listed = await contract.methods.isListed(tokenId).call();
			if (!listed){
				allListed.push(tokenId);
			}
		}
		return allListed;
	} catch (error) {
		console.log(error);
		return ([]);
	}
}

export async function senderAddress() {
	console.log("Web3: Called senderAddress");
    try {
        const result = await contract.methods.getSenderAddress().call();
        console.log("Sender address: ", result);
        return(result);
    } catch (error) {
        console.error("Error while reading.", error);
        return("error.");
    }
}

export async function getStamp(){
	console.log("Web3: Called getStamp");
    try {
        const time = await contract.methods.getTimeStamp().call();
        console.log(time);
        return time;
    } catch (error) {
        console.error(error);
    }
}

export async function getFirstCoin(){
	try {
		const result = await contract.methods.getTokenInfo(1).call();
		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
	}
}

export async function getSupply(){
	try {
		const supply = await contract.methods.getSupply().call();
		console.log("Supply ", supply);
		return supply;
	} catch (error) {
		console.error(error);
	}
}

export async function isListed(tokenId: number){
	console.log("Web3: Calling isListed.");
	try{
		const val = await contract.methods.isListed(tokenId).call();
		return val;
	} catch (error) {
		console.error(error);
	}
}