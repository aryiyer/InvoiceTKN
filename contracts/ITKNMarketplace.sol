// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract ITKNMarketplace {

    mapping(uint256 tokenId => Listing) listedTokens;
    uint256[] keys; //list of listings
    uint numListed = 0;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        bool listed;
        address seller;
    }

    constructor() {}

    /* LISTING FUNCTIONS */

    //List Item, price is in WEI
    function listItem(IERC721 nftAddress, uint256 _tokenId, uint256 _price) public {
        //check that token is valid
        

        //check that msg.sender is owner of token
        require(nftAddress.ownerOf(_tokenId) == msg.sender, "Marketplace listItem: sender is not token owner!");
        //check that token is not already listedTokens
        require(listedTokens[_tokenId].listed == false, "Marketplace listItem: token is already listed!");
        //check that marketplace has approval for the token
        require(nftAddress.getApproved(_tokenId) == address(this), "Marketplace listItem: token has not given approval to marketplace.");

        listedTokens[_tokenId] = Listing(_tokenId, _price, true, msg.sender);
        keys.push(_tokenId);
        numListed ++;
    }

    //Update Listing
    function updateListing(IERC721 nftAddress, uint256 _tokenId, uint256 _price) public {
        //check that msg.sender is owner of token
        require(nftAddress.ownerOf(_tokenId) == msg.sender, "Marketplace updateListing: sender is not token owner!");
        //check that token is not already listedTokens
        require(listedTokens[_tokenId].listed = true, "Marketplace updateListing: token is not yet listed!");
        
        //change the price of the token
        listedTokens[_tokenId].price = _price;
    }

    //Deslist Item
    function delistItem(IERC721 nftAddress, uint256 _tokenId) public {
        //check that msg.sender is owner of token
        require(nftAddress.ownerOf(_tokenId) == msg.sender, "Marketplace delistItem: sender is not token owner!");
        //check that token is not already listedTokens
        require(listedTokens[_tokenId].listed = true, "Marketplace delistItem: token is not yet listed!");

        //change listing status of token
        listedTokens[_tokenId].listed = false;
        for (uint i = 0; i < keys.length; i++){
            if (keys[i] == _tokenId) {
                delete keys[i];
            }
        }
        numListed --;
    }

    //Buy Item
    function buyItem(IERC721 nftAddress, uint256 _tokenId, address _to) external {
        //Assume that buyer has already been checked to have balance for the transaction
        
        //check that token is listed
        require(listedTokens[_tokenId].listed, "Marketplace buyItem: token is not listed!");

        address tokenOwner = nftAddress.ownerOf(_tokenId); 
        require(nftAddress.ownerOf(_tokenId) != _to, "Cannot buy a token that you own.");
        nftAddress.safeTransferFrom(tokenOwner, _to, _tokenId);

        delistItem(nftAddress, _tokenId);
    }

    /* UTILITY FUNCTIONS */

    //Get listed items
    function getListedItems() public view returns (uint256[] memory) {
       return keys;
    }

    //see if listed
    function isListed(uint256 _tokenId) public view returns (bool) {
        return (listedTokens[_tokenId].listed);
    }

    function getListingInfo(uint256 _tokenId) public view returns (Listing memory) {
        require(listedTokens[_tokenId].listed, "Marketplace buyItem: token is not listed!");
        return listedTokens[_tokenId];

    }

    //get listing price in WEI
    function getListingPrice(uint256 _tokenId) public view returns (uint256) {
        require(listedTokens[_tokenId].listed, "Marketplace buyItem: token is not listed!");
        return listedTokens[_tokenId].price;
    }

}