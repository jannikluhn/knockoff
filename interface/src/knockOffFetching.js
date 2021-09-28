import gql from "graphql-tag";
import { ethers } from "ethers";
import { throwError, errorCodes } from "./errors";
import { apolloClients } from "./apollo.js";

const knockOffTokenQuery = gql`
  query knockOffToken($id: ID!) {
    knockOffToken(id: $id) {
      id
      tokenID
      serialNumber
      ancestorSerialNumbers
      mintTimestamp
      owner

      contract {
        id
        chainID
        address
      }

      original {
        id
        tokenID
        contract {
          id
          chainID
          address
        }
      }
    }
  }
`;

function getKnockOffTokenID(chainID, contractAddress, tokenID) {
  return [
    "knockoff",
    chainID.toString(),
    ethers.utils.getAddress(contractAddress).toLowerCase(),
    ethers.BigNumber.from(tokenID).toString(),
  ].join("-");
}

export async function fetchKnockOffToken(
  chainID,
  contractAddress,
  tokenID,
  queryArgs
) {
  const knockOffTokenID = getKnockOffTokenID(chainID, contractAddress, tokenID);

  const client = apolloClients[chainID];
  if (!client) {
    throwError(
      errorCodes.UNEXPECTED_ERROR,
      "no apollo client for chain id " + chainID
    );
  }

  let result;
  try {
    result = await client.query({
      query: knockOffTokenQuery,
      variables: {
        id: knockOffTokenID,
      },
      ...queryArgs,
    });
  } catch (e) {
    throwError(errorCodes.APOLLO_ERROR, "failed to fetch knockoff token", e);
  }

  return result.data.knockOffToken;
}

export async function waitForKnockOffToken(chainID, contractAddress, tokenID) {
  const queryArgs = {
    fetchPolicy: "network-only",
  };
  for (;;) {
    const res = await fetchKnockOffToken(
      chainID,
      contractAddress,
      tokenID,
      queryArgs
    );
    if (res) {
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}
