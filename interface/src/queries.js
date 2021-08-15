import gql from "graphql-tag";
import { INT32_MAX } from "./constants.js";

function makeRecentERC721KnockOffQuery(chainID, pageSize, additionalArgs) {
  return {
    query: gql`
      query erc721KnockOffTokens($lastTimestamp: Int, $pageSize: Int) {
        erc721KnockOffTokens(
          orderBy: timestamp
          orderDirection: desc
          first: $pageSize
          where: { timestamp_lt: $lastTimestamp }
        ) {
          id
          tokenID
          serialNumber
          timestamp
        }
      }
    `,
    update: (data) => data.erc721KnockOffTokens,
    client: chainID,
    variables: {
      lastTimestamp: INT32_MAX,
      pageSize,
    },
    ...additionalArgs,
  };
}

export { makeRecentERC721KnockOffQuery };
