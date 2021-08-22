import { ethers } from "ethers";
import { contractFactories, interfaceIDs } from "./contracts.js";
import { throwError, errorCodes } from "./errors.js";
import { providers } from "./chains.js";

function makeNFTContractState() {
  return {
    hasCode: null,
    supportsIERC721: null,
    supportsIERC721Metadata: null,
  };
}

async function fetchOriginalContractState(chainID, contractAddress) {
  let state = makeNFTContractState();

  const provider = providers[chainID];
  if (provider === undefined) {
    throwError(
      errorCodes.UNEXPECTED_ERROR,
      "no provider for chain with id " + chainID
    );
  }

  // check if there's a contract at all
  let code;
  try {
    code = await provider.getCode(contractAddress);
  } catch (e) {
    throwError(
      errorCodes.CHAIN_ERROR,
      "failed to query contract code for address " + contractAddress,
      e
    );
  }
  if (code === "0x") {
    state.hasCode = false;
    return state;
  }
  state.hasCode = true;

  // check which interfaces it supports
  const attachedContract = contractFactories["IERC165"].attach(contractAddress);
  const contract = attachedContract.connect(provider);
  try {
    const [
      supportsIERC165,
      supportsNotIERC165,
      supportsIERC721,
      supportsIERC721Metadata,
    ] = await Promise.all([
      contract.supportsInterface(interfaceIDs["IERC165"]),
      contract.supportsInterface(interfaceIDs["NotIERC165"]),
      contract.supportsInterface(interfaceIDs["IERC721"]),
      contract.supportsInterface(interfaceIDs["IERC721Metadata"]),
    ]);
    if (supportsIERC165 && !supportsNotIERC165) {
      state.supportsIERC721 = supportsIERC721;
      state.supportsIERC721Metadata = supportsIERC721Metadata;
    } else {
      state.supportsIERC721 = false;
      state.supportsIERC721Metadata = false;
    }
  } catch (e) {
    if (e.code === ethers.errors.CALL_EXCEPTION) {
      state.supportsIERC721 = false;
      state.supportsIERC721Metadata = false;
    } else {
      throwError(
        errorCodes.CHAIN_ERROR,
        "failed to query contract for supported interfaces",
        e
      );
    }
  }

  return state;
}

function makeNFTTokenState() {
  return {
    exists: null,
    owner: null,
    erc721URI: null,
  };
}

async function fetchOriginalTokenState(
  chainID,
  contractAddress,
  tokenID,
  originalContractState
) {
  let state = makeNFTTokenState();

  const provider = providers[chainID];
  if (provider === undefined) {
    throwError(
      "no provider for chain with id " + chainID,
      errorCodes.UNEXPECTED_ERROR
    );
  }

  if (!originalContractState.hasCode) {
    return state;
  }

  if (originalContractState.supportsIERC721) {
    const attachedContract = contractFactories["IERC721"].attach(
      contractAddress
    );
    const contract = attachedContract.connect(provider);

    try {
      state.owner = await contract.ownerOf(tokenID);
      state.exists = true;
    } catch (e) {
      if (e.code === ethers.errors.CALL_EXCEPTION) {
        state.owner = null;
        state.exists = false;
      } else {
        throwError(errorCodes.CHAIN_ERROR, "failed to query token owner", e);
      }
    }
  }

  if (state.exists && originalContractState.supportsIERC721Metadata) {
    const attachedContract = contractFactories["IERC721Metadata"].attach(
      contractAddress
    );
    const contract = attachedContract.connect(provider);

    try {
      state.erc721URI = await contract.tokenURI(tokenID);
    } catch (e) {
      throwError(errorCodes.CHAIN_ERROR, "failed to query metadata URI", e);
    }
  }

  return state;
}

export { fetchOriginalContractState, fetchOriginalTokenState };
