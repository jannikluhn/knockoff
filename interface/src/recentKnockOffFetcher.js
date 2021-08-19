import gql from "graphql-tag";
import { INT32_MAX } from "./constants.js";

const pageSize = 2;

const recentKnockOffQuery = gql`
  query knockOffTokens($lastTimestamp: Int, $pageSize: Int) {
    knockOffTokens(
      orderBy: mintTimestamp
      orderDirection: desc
      first: $pageSize
      where: { mintTimestamp_lt: $lastTimestamp }
    ) {
      id
      tokenID
      serialNumber
      mintTimestamp
    }
  }
`;

class RecentKnockOffFetcher {
  constructor(clients) {
    this.clients = clients;
    this.chainIDs = [];
    this.done = {};
    this.lastTimestamp = {};
    this.tooOldTokens = [];

    for (const chainID in this.clients) {
      this.chainIDs.push(chainID);
      this.done[chainID] = false;
      this.lastTimestamp[chainID] = INT32_MAX;
    }
  }

  allTokensFetchedUntil() {
    let maxTimestamp = 0;
    for (const chainID of this.chainIDs) {
      if (this.done[chainID]) {
        continue;
      }
      maxTimestamp = Math.max(maxTimestamp, this.lastTimestamp[chainID]);
    }
    return maxTimestamp;
  }

  async fetchMore() {
    // query tokens with older timestamps than last request, for all chains (unless we already got
    // everything in a previous request).
    const queryPromises = [];
    const queryPromiseChainIDs = [];
    for (const chainID of this.chainIDs) {
      if (this.done[chainID]) {
        continue;
      }

      const client = this.clients[chainID];
      const promise = client.query({
        query: recentKnockOffQuery,
        variables: {
          lastTimestamp: this.lastTimestamp[chainID],
          pageSize: pageSize,
        },
      });

      queryPromises.push(promise);
      queryPromiseChainIDs.push(chainID);
    }
    const results = await Promise.all(queryPromises);

    // Update lastTimestamp and done, so that we continue from here in the next request (or don't,
    // if we already got everything).
    for (let i = 0; i < results.length; i++) {
      const chainID = queryPromiseChainIDs[i];
      const tokens = results[i].data.knockOffTokens;

      if (tokens.length === 0) {
        this.done[chainID] = true;
      } else {
        const lastToken = tokens[tokens.length - 1];
        this.lastTimestamp[chainID] = lastToken.mintTimestamp;
      }
    }

    // Merge the tokens we got from the individual requests as well as tokens from earlier calls
    // that haven't bee returned yet.
    let allTokens = [...this.tooOldTokens];
    for (const result of results) {
      allTokens.push(...result.data.knockOffTokens);
    }
    allTokens.sort((t1, t2) => t2.mintTimestamp - t1.mintTimestamp);

    // Return all tokens, as long as we can guarantee that we haven't missed any more recent ones
    // (because different chains may have been fetched until different timestamps).
    this.tooOldTokens = [];
    let returnedTokens = [];
    const cutoff = this.allTokensFetchedUntil();
    for (const t of allTokens) {
      if (t.mintTimestamp >= cutoff) {
        returnedTokens.push(t);
      } else {
        this.tooOldTokens.push(t);
      }
    }
    return returnedTokens;
  }
}

export { RecentKnockOffFetcher };
