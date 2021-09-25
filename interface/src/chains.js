import { ethers } from "ethers";

export const chains = {
  4: {
    name: "Rinkeby",
    pathSegment: "rinkeby",
    chainID: 4,
    erc721KnockOffsAddress: "0xDb2E7973D8e4d3ed5052f06d43462C41aEE6DF76",
    providerUrl:
      "https://rinkeby.infura.io/v3/cb47771bf3324acc895994de6752654b",
    graphUrl:
      "https://api.thegraph.com/subgraphs/name/jannikluhn/knockoffs-rinkeby",
  },
  5: {
    name: "Goerli",
    pathSegment: "goerli",
    chainID: 5,
    erc721KnockOffsAddress: "0x5576f07713D3aBEd1677Ad50AF90a461364FA42d",
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
