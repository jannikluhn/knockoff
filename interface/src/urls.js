import { ethers } from "ethers";
import { throwError, errorCodes } from "./errors";

export function isIpfsUrl(url) {
  return url.startsWith("ipfs://");
}

export function getIPFSGatewayURL(url) {
  let hash;
  if (url.startsWith("ipfs://ipfs/")) {
    hash = url.slice(12);
  } else {
    hash = url.slice(7);
  }
  return "https://ipfs.io/ipfs/" + hash;
}

export function isArweaveURL(url) {
  return url.startsWith("ar://");
}

export function getArweaveGatewayURL(url) {
  const hash = url.slice(5);
  return "https://arweave.net/" + hash;
}

export function isDataURI(uri) {
  return uri.startsWith("data:");
}

export function getMetadataFromDataURI(uri) {
  if (!uri.startsWith("data:application/json;base64,")) {
    throwError(
      errorCodes.NETWORK_ERROR,
      "ERC721 token URI has unsupported data URI format"
    );
  }
  const base64Data = uri.split(",")[1];
  try {
    const asByteArray = ethers.utils.base64.decode(base64Data);
    const asString = new TextDecoder().decode(asByteArray);
    const asJson = JSON.parse(asString);
    return asJson;
  } catch (e) {
    throwError(
      errorCodes.NETWORK_ERROR,
      "ERC721 token URI is invalid data URI"
    );
  }
}

export function getSourceURL(metadata) {
  const image = metadata["image"] || metadata["imageUrl"];
  if (!image) {
    return null;
  }
  if (isIpfsUrl(image)) {
    return getIPFSGatewayURL(image);
  }
  if (isArweaveURL(image)) {
    return getArweaveGatewayURL(image);
  }
  return image;
}

export function isVideoURL(srcURL) {
  return srcURL.endsWith(".mp4");
}
