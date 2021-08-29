import { ethers } from "ethers";

export const chains = {
  4: {
    name: "Rinkeby",
    pathSegment: "rinkeby",
    chainID: 4,
    erc721KnockOffsAddress: "0x6ed8558310F5236df59a021913313f8fb86c70F7",
    providerUrl:
      "https://rinkeby.infura.io/v3/cb47771bf3324acc895994de6752654b",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-rinkeby",
  },
  5: {
    name: "Goerli",
    pathSegment: "goerli",
    chainID: 5,
    erc721KnockOffsAddress: "0xe62e83aB3DC95Ac696ad3fa0bf16d4F93c6bbBc9",
    providerUrl: "https://goerli.infura.io/v3/cb47771bf3324acc895994de6752654b",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-goerli",
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
