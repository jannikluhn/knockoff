import { ethers } from "ethers";
import { contractFactories, interfaceIDs } from "./contracts.js";
import errors from "./errors.js";

function makeNFTContractLocation(chainID, contractAddress) {
  return {
    chainID: ethers.BigNumber.from(chainID),
    contractAddress: ethers.utils.getAddress(contractAddress),
  };
}

function getNFTContractLocationID(nftContract) {
  const idPreimage = ethers.utils.concat([
    ethers.utils.arrayify(nftContract.chainID),
    ethers.utils.arrayify(nftContract.contractAddress),
  ]);
  return ethers.utils.keccak256(idPreimage);
}

function makeNFTContractState() {
  return {
    hasCode: null,
    supportsIERC721: null,
    supportsIERC721Metadata: null,
    erc721Symbol: null,
    erc721Name: null,
  };
}

async function fetchNFTContractState(nftContractLocation, providers) {
  let state = makeNFTContractState();

  const provider = providers[nftContractLocation.chainID];
  if (provider === undefined) {
    ethers.logger.throwError(
      "no provider for chain with id " + nftContractLocation.chainID,
      errors.UNEXPECTED_ERROR
    );
  }

  // check if there's a contract at all
  const code = await provider.getCode(nftContractLocation.contractAddress);
  if (code == "0x") {
    state.hasCode = false;
    return state;
  }
  state.hasCode = true;

  // check which interfaces it supports
  const attachedContract = contractFactories["IERC165"].attach(
    nftContractLocation.contractAddress
  );
  const contract = attachedContract.connect(provider);
  const [supportsIERC721, supportsIERC721Metadata] = await Promise.all([
    contract.supportsInterface(interfaceIDs["IERC721"]),
    contract.supportsInterface(interfaceIDs["IERC721Metadata"]),
  ]);
  state.supportsIERC721 = supportsIERC721;
  state.supportsIERC721Metadata = supportsIERC721Metadata;

  // fetch ERC721 specific data
  if (state.supportsIERC721Metadata) {
    const attachedContract = contractFactories["IERC721Metadata"].attach(
      nftContractLocation.contractAddress
    );
    const contract = attachedContract.connect(provider);
    const [name, symbol] = await Promise.all([
      contract.name(),
      contract.symbol(),
    ]);
    state.erc721Name = name;
    state.erc721Symbol = symbol;
  }

  return state;
}

function makeNFTTokenLocation(nftContractLocationID, tokenID) {
  return {
    nftContractLocationID: nftContractLocationID,
    tokenID: ethers.BigNumber.from(tokenID),
  };
}

function getNFTTokenLocationID(nftTokenLocation) {
  const idPreimage = ethers.utils.concat([
    ethers.utils.arrayify(nftTokenLocation.nftContractLocationID),
    ethers.utils.arrayify(nftTokenLocation.tokenID),
  ]);
  return ethers.utils.keccak256(idPreimage);
}

function makeNFTTokenState() {
  return {
    exists: null,
    owner: null,
    erc721URI: null,
  };
}

async function fetchNFTTokenState(
  nftTokenLocation,
  nftContractLocation,
  nftContractState,
  providers
) {
  let state = makeNFTTokenState();

  const provider = providers[nftContractLocation.chainID];
  if (provider === undefined) {
    ethers.logger.throwError(
      "no provider for chain with id " + nftContractLocation.chainID,
      errors.UNEXPECTED_ERROR
    );
  }

  if (!nftContractState.hasCode) {
    return state;
  }

  if (nftContractState.supportsIERC721) {
    const attachedContract = contractFactories["IERC721"].attach(
      nftContractLocation.contractAddress
    );
    const contract = attachedContract.connect(provider);

    let owner;
    let exists;
    try {
      owner = await contract.ownerOf(nftTokenLocation.tokenID);
      exists = true;
    } catch (e) {
      if (e.code === ethers.errors.CALL_EXCEPTION) {
        exists = false;
      } else {
        throw e;
      }
    }
    state.owner = owner;
    state.exists = exists;
  }

  if (nftContractState.supportsIERC721Metadata) {
    const attachedContract = contractFactories["IERC721Metadata"].attach(
      nftContractLocation.contractAddress
    );
    const contract = attachedContract.connect(provider);

    state.erc721URI = await contract.tokenURI(nftTokenLocation.tokenID);
  }

  return state;
}

function joinNFTTokenState(
  nftTokenLocation,
  nftTokenState,
  nftContractLocation,
  nftContractState
) {
  return {
    ...nftTokenState,
    nftTokenLocation: {
      ...nftTokenLocation,
      nftContractLocation: nftContractLocation,
    },
    nftContractState: {
      ...nftContractState,
      nftContractLocation: nftContractLocation,
    },
  };
}

async function fetchERC721JSON(joinedNFTTokenState) {
  const response = await window.fetch(joinedNFTTokenState.erc721URI, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw ethers.throwError(
      "Got error when requesting ERC721 metadata JSON",
      errors.NETWORK_ERROR
    );
  }
  return await response.json();
}

export {
  makeNFTContractLocation,
  getNFTContractLocationID,
  makeNFTContractState,
  fetchNFTContractState,
  makeNFTTokenLocation,
  getNFTTokenLocationID,
  fetchNFTTokenState,
  joinNFTTokenState,
  fetchERC721JSON,
};
