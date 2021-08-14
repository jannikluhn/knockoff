// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TestERC721 is ERC721URIStorage {
    constructor() ERC721("TestERC721", "TTT") {}

    function mint(address receiver, uint256 tokenID) external {
        _mint(receiver, tokenID);
        _setTokenURI(tokenID, string(abi.encodePacked("url", tokenID)));
    }
}
