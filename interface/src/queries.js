import gql from "graphql-tag";

function makeRecentERC721KnockOffQuery(chainID, pageSize, additionalArgs) {
  return {
    query: gql`
      query erc721KnockOffTokens($lastTimestamp: Int, $pageSize: Int) {
        erc721KnockOffTokens(
          orderBy: timestamp
          orderDirection: desc
          first: $pageSize
          where: { timestamp_gt: $lastTimestamp }
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
      lastTimestamp: 0,
      pageSize,
    },
    ...additionalArgs,
  };
}

export { makeRecentERC721KnockOffQuery };
