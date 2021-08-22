import { ethers } from "ethers";
import { contractFactories, interfaceIDs } from "./contracts.js";
import { throwError, errorCodes } from "./errors.js";
import { providers } from "./chains.js";

function makeNFTContractState() {
  return {
    hasCode: null,
    supportsIERC721: null,
    supportsIERC721Metadata: null,
    erc721Symbol: null,
    erc721Name: null,
  };
}

async function fetchOriginalContractState(chainID, contractAddress) {
  let state = makeNFTContractState();

  const provider = providers[chainID];
  if (provider === undefined) {
    throwError(
      "no provider for chain with id " + chainID,
      errorCodes.UNEXPECTED_ERROR
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
  if (code == "0x") {
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

  // fetch ERC721 specific data
  if (state.supportsIERC721Metadata) {
    const attachedContract = contractFactories["IERC721Metadata"].attach(
      contractAddress
    );
    const contract = attachedContract.connect(provider);
    try {
      const [name, symbol] = await Promise.all([
        contract.name(),
        contract.symbol(),
      ]);
      state.erc721Name = name;
      state.erc721Symbol = symbol;
    } catch (e) {
      throwError(
        errorCodes.CHAIN_ERROR,
        "failed to check contract name and symbol",
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
  nftContractState
) {
  let state = makeNFTTokenState();

  const provider = providers[chainID];
  if (provider === undefined) {
    throwError(
      "no provider for chain with id " + chainID,
      errorCodes.UNEXPECTED_ERROR
    );
  }

  if (!nftContractState.hasCode) {
    return state;
  }

  if (nftContractState.supportsIERC721) {
    const attachedContract = contractFactories["IERC721"].attach(
      contractAddress
    );
    const contract = attachedContract.connect(provider);

    let owner;
    let exists;
    try {
      owner = await contract.ownerOf(tokenID);
      exists = true;
    } catch (e) {
      if (e.code === ethers.errors.CALL_EXCEPTION) {
        exists = false;
      } else {
        throwError(errorCodes.CHAIN_ERROR, "failed to query token owner", e);
      }
      state.owner = owner;
      state.exists = exists;
    }
  }

  if (nftContractState.supportsIERC721Metadata) {
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
