import { ethers } from "ethers";

export const chains = {
  1: {
    name: "Ethereum",
    pathSegment: "ethereum",
    erc721KnockOffsAddress: "0xB6610B13496f42fa72BBa6a0ca20e5b72a11CE39",
    chainID: 1,
    providerUrl:
      "https://mainnet.infura.io/v3/cb47771bf3324acc895994de6752654b",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-mainnet",
  },
  100: {
    name: "xDai",
    pathSegment: "xdai",
    chainID: 100,
    erc721KnockOffsAddress: "0x756ce48FbF69338027040A11DC2d510Ef03dd3f7",
    providerUrl: "https://rpc.xdaichain.com/",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-xdai",
  },
  137: {
    name: "Polygon",
    pathSegment: "polygon",
    chainID: 137,
    erc721KnockOffsAddress: "0x09761ffd493B7d15FdA56A270d93aE60954404d8",
    providerUrl:
      "https://polygon-mainnet.infura.io/v3/cb47771bf3324acc895994de6752654b",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-matic",
  },
  42161: {
    name: "Arbitrum",
    pathSegment: "arbitrum",
    chainID: 42161,
    erc721KnockOffsAddress: "0xf14140A166652B26D402E899c416c85E189DD645",
    providerUrl: "https://arb1.arbitrum.io/rpc",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-arbitrum",
  },
};

export const chainNames = Object.fromEntries(
  Object.entries(chains).map(([k, v]) => {
    return [k, v.name];
  })
);

export const providers = Object.fromEntries(
  Object.entries(chains).map(([k, v]) => {
    return [k, new ethers.providers.JsonRpcProvider(v.providerUrl, v.chainID)];
  })
);

export function pathSegmentToChainID(segment) {
  const segmentLowerCase = segment.toLowerCase();
  for (const v of Object.values(chains)) {
    if (v.pathSegment === segmentLowerCase) {
      return v.chainID;
    }
  }
  return null;
}

export function chainIDToPathSegment(chainID) {
  return chains[chainID].pathSegment;
}
