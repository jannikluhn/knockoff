import { ethers } from "ethers";
import { throwError, errorCodes } from "./errors";
import { providers } from "./chains.js";
import { contractFactories } from "./contracts";
import { getCORSProxyURL } from "./cors.js";
import {
  isDataURI,
  getMetadataFromDataURI,
  isIpfsUrl,
  getIPFSGatewayURL,
  isArweaveURL,
  getArweaveGatewayURL,
} from "./urls.js";

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
      "failed to read ERC721 URI from contract",
      e
    );
  }
  if (uri.length === 0) {
    throwError(errorCodes.CHAIN_ERROR, "ERC721 URI of token is empty");
  }

  if (isDataURI(uri)) {
    return getMetadataFromDataURI(uri);
  }

  if (isIpfsUrl(uri)) {
    uri = getIPFSGatewayURL(uri);
  }
  if (isArweaveURL(uri)) {
    uri = getArweaveGatewayURL(uri);
  }

  const response = await window.fetch(getCORSProxyURL(uri));
  if (!response.ok) {
    throwError(
      errorCodes.NETWORK_ERROR,
      "failed to fetch ERC721 JSON metadata"
    );
  }

  try {
    return await response.json();
  } catch (e) {
    throwError(
      errorCodes.NETWORK_ERROR,
      "ERC721 token URI points to invalid JSON",
      e
    );
  }
}

export { fetchERC721Metadata };
