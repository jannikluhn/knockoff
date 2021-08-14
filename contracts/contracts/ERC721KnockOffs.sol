// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

struct Original {
    uint256 tokenID;
    IERC721Metadata erc721Contract;
    uint64 numKnockOffs;
}

contract ERC721KnockOffs is ERC721Enumerable {
    event Minted(
        IERC721Metadata originalContract,
        uint256 originalTokenID,
        address receiver,
        uint256 tokenID,
        uint64 serialNumber
    );

    error NonexistantToken(uint256 tokenID);

    mapping(uint256 => Original) public originals; // original id => Original
    mapping(uint256 => uint64) public serialNumbers; // token id => serial number

    constructor() ERC721("KnockOffs", "KNO") {}

    function mint(
        address receiver,
        IERC721Metadata originalContract,
        uint256 originalTokenID
    ) external {
        // Check that the token exists (most ERC721 implementations throw here, even if it's not
        // explicitly required in the standard).
        originalContract.ownerOf(originalTokenID);

        // Save a reference to the original if this hasn't been done so yet. Increment the number
        // of copies if it has.
        uint256 _originalID = originalID(originalContract, originalTokenID);
        Original memory original = originals[_originalID];
        if (original.numKnockOffs == 0) {
            original = Original({
                tokenID: originalTokenID,
                erc721Contract: originalContract,
                numKnockOffs: 1
            });
        } else {
            original.numKnockOffs += 1;
        }

        // Compute the token ID of the knock off.
        uint64 serialNumber = uint64(original.numKnockOffs) - 1;
        uint256 tokenID = _originalID + serialNumber;
        assert(!_exists(tokenID));

        // Store the original as well as the knock off's serial number and mint the token.
        originals[_originalID] = original;
        serialNumbers[tokenID] = serialNumber;
        _mint(receiver, tokenID);

        emit Minted({
            originalContract: originalContract,
            originalTokenID: originalTokenID,
            receiver: receiver,
            tokenID: tokenID,
            serialNumber: serialNumber
        });
    }

    function exists(uint256 tokenID) external view returns (bool) {
        return _exists(tokenID);
    }

    function tokenURI(uint256 tokenID)
        public
        view
        override
        returns (string memory)
    {
        if (!_exists(tokenID)) {
            revert NonexistantToken(tokenID);
        }

        uint256 _originalID = originalIDForToken(tokenID);
        Original memory original = originals[_originalID];

        return original.erc721Contract.tokenURI(original.tokenID);
    }

    function originalIDForToken(uint256 tokenID) public view returns (uint256) {
        return tokenID - serialNumbers[tokenID];
    }

    function originalForToken(uint256 tokenID)
        external
        view
        returns (Original memory)
    {
        uint256 _originalID = originalIDForToken(tokenID);
        return originals[_originalID];
    }

    function originalID(IERC721 originalContract, uint256 originalTokenID)
        public
        pure
        returns (uint256)
    {
        bytes memory encoded = abi.encodePacked(
            address(originalContract),
            originalTokenID
        );
        return uint256(keccak256(encoded));
    }
}
