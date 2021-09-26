import { ethers } from "ethers";

const dateFormat = new Intl.DateTimeFormat([]);

export function formatTimestampAsDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return dateFormat.format(date);
}

export function formatAddress(address) {
  const s = ethers.utils.getAddress(address);
  return s.slice(0, 6) + "..." + s.slice(-4);
}

export function formatTokenID(tokenID) {
  const s = tokenID.toString();
  if (s.length <= 40) {
    return s;
  }
  return s.slice(0, 4) + "..." + s.slice(-4);
}
