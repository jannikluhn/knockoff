<template>
  <div>
    <p>Gallery</p>
    <p>
      {{ allRecentERC721KnockOffTokens }}
    </p>
    <button @click="fetchMore">Fetch More</button>
  </div>
</template>

<script>
import Vue from "vue";
import { makeRecentERC721KnockOffQuery } from "../queries.js";
import { chains } from "../chains.js";
import { INT32_MAX } from "../constants.js";

const pageSize = 2;

function cmpTokenTimestampRev(token1, token2) {
  return token2.timestamp - token1.timestamp;
}

export default {
  name: "Gallery",

  data() {
    return {
      recentERC721KnockOffTokenKeys: {},
      recentERC721KnockOffTokens: {},
      recentERC721KnockOffTokensDone: {},
    };
  },

  created() {
    for (const chain in chains) {
      const query = makeRecentERC721KnockOffQuery(chain, pageSize, {
        manual: true,
        result: this.handleRecentERC721KnockOffResult,
      });

      const key = "recentERC721KnockOffTokens" + chain;
      Vue.set(this.recentERC721KnockOffTokenKeys, chain, key);
      Vue.set(this.recentERC721KnockOffTokens, key, []);
      Vue.set(this.recentERC721KnockOffTokensDone, key, false);

      this.$apollo.addSmartQuery(key, query);
    }
  },

  computed: {
    allRecentERC721KnockOffTokens() {
      // Tokens from different sources may be fetched up until different timestamps. We want to
      // be sure that we don't miss any token newer than the oldest token we show. Therefore, we
      // show  only those tokens that are newer than a cutoff. The cutoff is computed as follows:
      // For each source, take the timestamp of the oldest token. The cutoff is the newest
      // timestamp of those. Sources that have been fully fetched are not considered.
      let oldestTimestampPerSource = [];
      for (const key of Object.values(this.recentERC721KnockOffTokenKeys)) {
        if (this.recentERC721KnockOffTokensDone[key]) {
          continue;
        }
        const tokensFromSource = this.recentERC721KnockOffTokens[key];
        if (tokensFromSource.length === 0) {
          oldestTimestampPerSource.push(Infinity);
        } else {
          const oldestTokenFromSource =
            tokensFromSource[tokensFromSource.length - 1];
          oldestTimestampPerSource.push(oldestTokenFromSource.timestamp);
        }
      }
      const cutoffTimestamp = Math.max(...oldestTimestampPerSource);

      // find all tokens newer than the cutoff timestamp
      let tokens = [];
      for (const ts of Object.values(this.recentERC721KnockOffTokens)) {
        for (const t of ts) {
          if (t.timestamp >= cutoffTimestamp) {
            tokens.push(t);
          }
        }
      }

      // sort by timestamp, newest first
      tokens.sort(cmpTokenTimestampRev);
      return tokens;
    },
  },

  methods: {
    handleRecentERC721KnockOffResult(result, key) {
      const newTokens = result.data.erc721KnockOffTokens;
      let tokens = this.recentERC721KnockOffTokens[key];
      tokens.push(...newTokens);
      tokens.sort(cmpTokenTimestampRev);
      if (newTokens.length < pageSize) {
        this.recentERC721KnockOffTokensDone[key] = true;
      }
    },

    fetchMore() {
      for (const key of Object.values(this.recentERC721KnockOffTokenKeys)) {
        // don't fetch again if we didn't get a response last time
        if (this.recentERC721KnockOffTokensDone[key]) {
          continue;
        }

        // fetch tokens older than the oldest one we have so far
        let lastTimestamp;
        const tokens = this.recentERC721KnockOffTokens[key];
        if (tokens.length === 0) {
          lastTimestamp = INT32_MAX;
        } else {
          lastTimestamp = tokens[tokens.length - 1].timestamp;
        }

        // send query
        const query = this.$apollo.queries[key];
        query.fetchMore({
          variables: {
            lastTimestamp: lastTimestamp,
          },
          updateQuery: (_, { fetchMoreResult }) => {
            // the result handler that's already registered will merge the new with the existing
            // data
            return fetchMoreResult;
          },
        });
      }
    },
  },
};
</script>
