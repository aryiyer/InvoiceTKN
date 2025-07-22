// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract InvoiceTKN2 is ERC721Enumerable{

    address owner;
    mapping(address => string role) roleList;
    uint256 private _nextTokenId = 1;

    mapping(uint256 tokenId => tokenData tokenInfo) tokens;
    mapping(address => uint256[] tokenList) minted;


    struct tokenData {
        //immutables
        uint256 tokenId;
        string name;
        uint value;
        uint yield;
        //mutables
        bool valid;
        address minter; 
        uint maturityDate;
    }


    constructor() ERC721("InvoiceTKN2", "ITKN"){
        owner = msg.sender;
        roleList[owner] = "owner";
    }
    

    function mintToken(string memory _name, uint daysAfter, uint _value, uint _yield) public {     
        string memory role = getRole(msg.sender);
        require(compareStrings(role, "minter") || compareStrings(role, "owner"), "Not approved to mint a token.");
        
        //adding token data to storage
            tokenData memory dataStruct;
            dataStruct.tokenId = _nextTokenId;
            dataStruct.name = _name;
            dataStruct.value = _value;
            
            dataStruct.yield = _yield;
            dataStruct.valid = true;
            dataStruct.minter = msg.sender;
            //number of seconds after unix epoch + seconds of the maturity period
            dataStruct.maturityDate = block.timestamp + daysAfter*24*60*60;
        
        //adding minted token to record of minter
        minted[msg.sender].push(_nextTokenId);

        //adding dataStruct to storage
        tokens[_nextTokenId] = dataStruct;
        
        _safeMint(msg.sender, _nextTokenId);
    
        _nextTokenId ++;
    }


    /* ROLE FUNCTIONS */
    function onboardUser(address newUser, string calldata role) public {
        require(msg.sender == owner, "Only the contract owner can onboard new users.");
        require(compareStrings(role, "minter") || compareStrings(role, "investor") || compareStrings(role, "owner"), "NFT onboardUser: Not a valid role.");

        roleList[newUser] = role;
    }


    function changeRole(address user, string calldata role) public {
        require(msg.sender == owner, "Only the contract owner can change user roles.");
        string memory currRole = roleList[user];
        require(!compareStrings(currRole, ""), "Address is not yet onboarded!");
        require(compareStrings(role, "minter") || compareStrings(role, "investor") || compareStrings(role, "owner"), "NFT onboardUser: Not a valid role.");

        roleList[user] = role;
    }

    function removeUser(address user) public {
        require(msg.sender == owner, "Only the contract owner can remove users.");
        string memory currRole = roleList[user];
        require(!compareStrings(currRole, ""), "Address is not yet onboarded!");
        roleList[user] = "";
    }

    /* UTILITY FUNCTIONS */

    //Method to return all minted tokens of an address
    function getMintedTokens(address addy) public view returns(uint256[] memory){
        return minted[addy];
    }

    function getMinter(uint256 tokenId) public view returns (address) {
        require(contains(tokenId), "getMinter: Token must exist!");
        return(tokens[tokenId].minter);
    }
    
    function contains(uint256 tokenId) public view returns (bool) {
        return(tokens[tokenId].tokenId != 0); //if the key isn't mapped yet, the default value of tokenId is 0.
    }

    //Method to return the information of a token.
    function getTokenInfo(uint256 tokenId) public view returns (tokenData memory){
        require(contains(tokenId), "getTokenInfo: Token must exist!");
        return(tokens[tokenId]);
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function getRole(address addy) public view returns(string memory) {
        return (roleList[addy]);
    }

    function setValidity(bool v, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner || isApprovedForAll(tokenOwner, msg.sender) || msg.sender == getApproved(tokenId));
        tokens[tokenId].valid = v;
    }
}