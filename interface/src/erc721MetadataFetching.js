import { ethers } from "ethers";
import { throwError, errorCodes } from "./errors";
import { providers } from "./chains.js";
import { contractFactories } from "./contracts";

let cache = {};

function computeCacheKey(chainID, contractAddress, tokenID) {
  return (
    chainID +
    "-" +
    contractAddress +
    "-" +
    ethers.BigNumber.from(tokenID).toString()
  );
}

async function fetchERC721Metadata(chainID, contractAddress, tokenID) {
  const cacheKey = computeCacheKey(chainID, contractAddress, tokenID);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const metadata = fetchJSONMetadataNoCache(chainID, contractAddress, tokenID);
  cache[cacheKey] = metadata;

  return metadata;
}

async function fetchJSONMetadataNoCache(chainID, contractAddress, tokenID) {
  const provider = providers[chainID];
  const attachedContract = contractFactories["IERC721Metadata"].attach(
    contractAddress
  );
  const contract = attachedContract.connect(provider);

  let uri;
  try {
    uri = await contract.tokenURI(tokenID);
  } catch (e) {
    throwError(
      errorCodes.CHAIN_ERROR,
      "failed to read ERC721 URI from contract"
    );
  }

  const response = await window.fetch(uri, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  });
  if (!response.ok) {
    throwError(
      errorCodes.NETWORK_ERROR,
      "failed to fetch ERC721 JSON metadata"
    );
  }

  return await response.json();
}

export { fetchERC721Metadata };
