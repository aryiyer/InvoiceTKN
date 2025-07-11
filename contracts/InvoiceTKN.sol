// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Utils} from "./ERC721Utils.sol";

//TODO:

//Change design doc - edit the section about settlement
//no need for early settlement
//the person who pays the holder of the token is the minter, not the original buyer

//Think of a way to calculate the changes in value of the token as it reaches maturity date

//there should be some kind of reminders as the date gets closer, or maybe balance checks


contract InvoiceTKN {
    // state variables

    uint public currentTokenId = 1;
    address owner;
    uint startTime;

    //mapping from address owner to pair of tokenList and size of list
    mapping(address => tokensOwned) owning;

    //mapping from address to pair of tokenMinted and size of list
    mapping(address => tokensMinted) minted;

    //All the data of each token is stored in these below mappings
    //tokenId to struct
    mapping(uint256 => tokenData) tokens;

    //address of account to check => address of operator to check = whether the operator has approval for the account.
    mapping(address => mapping(address => bool)) operatorApproval;

    address[] minters;
    address[] investors;

    //array of all listed tokenIds
    uint256[] listed;

    //struct that holds token data
    struct tokenData {
        uint256 tokenId;
        string info;
        uint value;
        uint yield;
        address[] ownerHistory; //is it needed if we have a log of transfer events?
        bool valid;
        bool listed;
        uint256 listingPrice;
        address minter; 
        address approved;
        uint maturityDate;
    }

    struct tokensOwned {
        uint256[] tokenList;
        uint size; //number of VALID tokens
    }

    struct tokensMinted {
        uint256[] tokenList;
        uint size; //number of VALID tokens
    }

    // constructor:
    constructor(){
        //owner of the contract is the one who deploys it
        owner = msg.sender;
        startTime = block.timestamp;
    }

    /*
    // EVENTS
    */

    //Transfer(from, to, tokenId)
    event Transfer(address from, address to, uint256 tokenId);

    //Approval(owner, approved, tokenId)
    event Approval(address owner, address approved, uint256 tokenId);

    //ApprovalForAll(owner, operator, approved)
    event ApprovalForAll(address owner, address operator, bool approved);
    //SettleCoin(minter, owner, tokenId)

    /*
    // FUNCTIONS
    */

    // Ary coin functionality:

    //mintCoin - takes in all the necessary fields as the form of a strict
    function mintCoin(string memory strInfo, address _minter, address to, uint daysAfter, uint _value, uint _yield) public {     
        //ensure that the minter is the owner of the contract
        require(msg.sender == owner, "Coin must be minted from the owner's account");
        bool isMinter = false;
        for (uint i = 0; i < minters.length; i++){
            if (minters[i] == _minter){
                isMinter = true;
            }
        }
        require(isMinter, "Account is not registered as a minter!");

        tokenData memory dataStruct;
        dataStruct.tokenId = currentTokenId;
        dataStruct.info = strInfo;
        dataStruct.valid = true;
        dataStruct.listed = false;
        dataStruct.minter = _minter;
        dataStruct.value = _value;
        dataStruct.yield = _yield;
        //number of seconds after unix epoch + seconds of the maturity period
        dataStruct.maturityDate = block.timestamp + daysAfter*24*60*60;
        
        //adding minted token to record of minter
        minted[_minter].tokenList.push(currentTokenId);
        minted[_minter].size ++;

        //adding dataStruct to storage
        tokens[currentTokenId] = dataStruct;
        //adding tokenId and owner info to the struct in storage
        tokens[currentTokenId].ownerHistory.push(to);
        owning[to].tokenList.push(currentTokenId);
        owning[to].size ++;

        currentTokenId++;
    }

    //settleCoin - mark a token as having been settled. method should be called from outside
    //the contract under the condition that the minter of the token has paid the owner of the token
    //whatever the value of the token is
    function settleCoin(uint256 tokenId) public {
        //sender must be the coin minter
        require(msg.sender == tokens[tokenId].minter);

        //Actual crypto transfer logic must be done outside of the contract
        //sender must have enough balance in account to settle the value of the token
        //how to transfer other currency from account? must be done in the js file probably

        //set token to be invalid, but is still owned by the owner
        tokens[tokenId].valid = false;
        owning[ownerOf(tokenId)].size --;
    }

    function listCoin(uint256 tokenId, uint256 price) public {
        require(!tokens[tokenId].listed, "Token must not already be listed!");
        address tokenOwner = ownerOf(tokenId);
        require(((msg.sender == tokenOwner) || (getApproved(tokenId) == msg.sender) || (operatorApproval[tokenOwner][msg.sender] == true)), "Caller does not meet requirements to transfer token.");
        setApprovalForAll(address(this), true);
        listed.push(tokenId);
        tokens[tokenId].listingPrice = price;
        tokens[tokenId].listed = true;
        tokens[tokenId].approved = address(0);
    }

    function delistCoin(uint256 tokenId) public {
        require(tokens[tokenId].listed, "Token must already be listed!");
        address tokenOwner = ownerOf(tokenId);
        require(((msg.sender == tokenOwner) || (getApproved(tokenId) == msg.sender) || (operatorApproval[tokenOwner][msg.sender] == true)), "Caller does not meet requirements to transfer token.");
        for (uint i = 0; i < listed.length; i++){
            if (listed[i] == tokenId){
                delete listed[i];
            }
        }
        tokens[tokenId].listed = false;
        tokens[tokenId].approved = address(0);
    }

    function buyCoin(uint256 tokenId) public {
        //assuming that msg.sender has enough balance
        delistCoin(tokenId);
        address oldOwner = ownerOf(tokenId);
        safeTransferFrom(oldOwner, msg.sender, tokenId);
    }

    // ERC721 Necessary:
    
    //balanceOf(owner)
    function balanceOf(address user) public view returns (uint) {
        //add check to ensure that user exists
        return(owning[user].size);
    }
    
    //ownerOf(tokenId) - returns the address of the owner of the given tokenId
    function ownerOf(uint256 tokenId) public view returns (address)  {
        //tokenId must exist
        require(contains(tokenId), "ownerOf: tokenId does not exist.");

        unchecked {
        uint recentOwnerIndex = tokens[tokenId].ownerHistory.length-1;
        require(recentOwnerIndex >= 0, "Error: Token does not have any owners!");
        return(
            tokens[tokenId].ownerHistory[recentOwnerIndex]
        );
        }
        
    }

    //safeTransferFrom(from, to, tokenId)
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    //safeTransferFrom(from, to, tokenId, data)
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        transferFrom(from, to, tokenId);
        ERC721Utils.checkOnERC721Received(msg.sender, from, to, tokenId, data);
    }

    //transferFrom(from, to, tokenId) - transfers a token from an address to an address
    function transferFrom(address from, address to, uint256 tokenId) public {
        //tokenId must exist
        require(contains(tokenId), "transferFrom: tokenId does not exist.");
        //from and to cannot be the zero address
        require((from != address(0) && to != address(0)), "Source and destination address cannot be zero.");

        //check that from address owns the token
        require(ownerOf(tokenId) == from, "From address does not own tokenId.");


        require(((msg.sender == from) || (getApproved(tokenId) == msg.sender) || (operatorApproval[from][msg.sender] == true)), "Caller does not meet requirements to transfer token.");

        //check that the token is valid
        require(tokens[tokenId].valid == true);

        //delete token from old owner's mapping
        for(uint i = 0; i < owning[from].tokenList.length; i++){
            if (owning[from].tokenList[i] == tokenId){
                delete owning[from].tokenList[i];
                owning[from].size --;
            }
        }

        //add new owner to token's owner history
        tokens[tokenId].ownerHistory.push(to);

        //add token to new owner's owned tokens
        owning[to].tokenList.push(tokenId);
        owning[to].size ++;

        //removing token approvals
        tokens[tokenId].approved = address(0);
        
        //add event
        emit Transfer(from, to, tokenId);

    }

    //Allow an external address to transfer token. approval is cleared after the token is transferred.
    function approve(address to, uint256 tokenId) public {
        require(contains(tokenId), "approve: tokenId does not exist.");

        //only token owner can call this function
        require(msg.sender == ownerOf(tokenId), "Only the token owner can approve an account.");

        bool isApproved = (getApproved(tokenId) != address(0));
        require(isApproved == false, "Token already has a single use approval.");
        tokens[tokenId].approved = to;

        emit Approval(msg.sender, to, tokenId);
    }

    //Returns the address of the account approved for the token, or zero if none exists
    function getApproved(uint256 tokenId) public view returns (address) {
        require(contains(tokenId), "getApproved: tokenId does not exist.");
        return(tokens[tokenId].approved);
    }

    //Gives or takes operator approval to transfer ANY token that caller owns
    //Only acts on the tokens belonging to msg.sender
    function setApprovalForAll(address operator, bool _approved) public {
        //operator cannot be 0 address
        require (operator != address(0), "Operator address cannot be the zero address!");
        //sets the operatorApproval status of the operator linked to msg.sender to the bool parameter
        operatorApproval[msg.sender][operator] = _approved;

        emit ApprovalForAll(msg.sender, operator, _approved);
    }

    //Checks if operator is approved for ownerAcc
    function isApprovedForAll(address ownerAcc, address operator) public view returns (bool) {
        return(operatorApproval[ownerAcc][operator]);
    }


    /*
    // Utility/Debugging methods
    */

   function getSupply() public view returns (uint) {
        return (currentTokenId-1);
   }

   //Method to return all listed tokens
    function getListedTokens() public view returns (uint256[] memory){
        return listed;
    }

    //Method to return all minted tokens
    function getMintedTokens(address addy) public view returns(uint256[] memory){
        return minted[addy].tokenList;
    }

   //Method to return the information of a token. json format?
   function getTokenInfo(uint256 tokenId) public view returns (tokenData memory){
        require(contains(tokenId), "getTokenInfo: Token must exist!");
        return(tokens[tokenId]);
   }

//    function lightTokenInfo(uint256 tokenId) public view returns(string memory strInfo, uint val, uint matureDate, uint yield, uint value){
//    }


   //returns the address of the message sender
   function getSenderAddress() public view returns (address) {
        return (msg.sender);
   }

    //Given a user account, returns an array with all of the tokens that they own.
   function getOwning(address acc) public view returns (uint256[] memory) {
        return(owning[acc].tokenList);
   }

   function contains(uint256 tokenId) public view returns (bool) {
        return(tokens[tokenId].tokenId != 0); //if the key isn't mapped yet, the default value of tokenId is 0.
   }

   function getMinter(uint256 tokenId) public view returns (address) {
        require(contains(tokenId), "getMinter: Token must exist!");
        return(tokens[tokenId].minter);
   }

   function secondsUntilMaturity(uint256 tokenId) public view returns (uint) {
        require(contains(tokenId), "secondsUntilMaturity: tokenId does not exist.");
        return(tokens[tokenId].maturityDate - block.timestamp);
   }

   function getTimeStamp() public view returns (uint) {
        return(block.timestamp);
   }

   function isValid(uint256 tokenId) public view returns (bool) {
        require(contains(tokenId), "isValid: tokenId does not exist.");
        return(tokens[tokenId].valid);
   }
   
    function isListed(uint256 tokenId) public view returns (bool) {
        require(contains(tokenId), "isListed: tokenId does not exist.");
        return(tokens[tokenId].listed);
   }

   function listPrice(uint256 tokenId) public view returns (uint256) {
        require(contains(tokenId), "listPrice: tokenId does not exist.");
        return(tokens[tokenId].listingPrice);
   }

   function addMinter(address addy) public {
        minters.push(addy);
   }

   function addInvestor(address addy) public {
        investors.push(addy);
   }

   function getMinters() public view returns (address[] memory){
        return minters;
   }

   function getInvestors() public view returns (address[] memory){
        return investors;
   }
}