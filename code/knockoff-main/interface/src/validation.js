import { ethers } from "ethers";
import { MAX_TOKEN_ID } from "./constants.js";

export function isValidAddress(address) {
  try {
    ethers.utils.getAddress(address);
  } catch {
    return false;
  }
  return true;
}

export function isValidTokenID(tokenID) {
  let tokenIDBig;
  try {
    tokenIDBig = ethers.BigNumber.from(tokenID);
  } catch (e) {
    return false;
  }
  return tokenIDBig.gte(0) && tokenIDBig.lte(MAX_TOKEN_ID);
}
