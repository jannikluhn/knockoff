<template>
  <div>
    <p>Gallery</p>
    <p>{{ allERC721KnockOffTokens }}</p>
    <button @click="fetchMore">Fetch More</button>
  </div>
</template>

<script>
import Vue from "vue";
import { makeRecentERC721KnockOffQuery } from "../queries.js";
import { chains } from "../chains.js";

const pageSize = 2;

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
    allERC721KnockOffTokens() {
      // Tokens from different sources may be fetched up until different timestamps. We want to
      // be sure that we don't miss any token newer than the oldest token we show.
      let cutoffTimestamp = 0;
      for (const key of Object.values(this.recentERC721KnockOffTokenKeys)) {
        if (this.recentERC721KnockOffTokensDone[key]) {
          continue;
        }
        const tokensFromSource = this.recentERC721KnockOffTokens[key];
        if (tokensFromSource.length === 0) {
          cutoffTimestamp = Infinity;
          break;
        }
        const latestTokenFromSource =
          tokensFromSource[tokensFromSource.length - 1];
        if (latestTokenFromSource.timestamp >= cutoffTimestamp) {
          cutoffTimestamp = latestTokenFromSource.timestamp;
        }
      }

      console.log(cutoffTimestamp);

      // find all tokens newer than the cutoff timestamp
      let tokens = [];
      for (const ts of Object.values(this.recentERC721KnockOffTokens)) {
        for (const t of ts) {
          if (t.timestamp >= cutoffTimestamp) {
            tokens.push(t);
          }
        }
      }
      return tokens;
    },
  },

  methods: {
    handleRecentERC721KnockOffResult(result, key) {
      const newTokens = result.data.erc721KnockOffTokens;
      this.recentERC721KnockOffTokens[key].push(...newTokens);
      if (newTokens.length === 0) {
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
        let lastTimestamp = 0;
        const tokens = this.recentERC721KnockOffTokens[key];
        if (tokens.length === 0) {
          lastTimestamp = 0;
        } else {
          lastTimestamp = tokens[tokens.length - 1].timestamp;
        }

        // query, adding the result to our list
        const query = this.$apollo.queries[key];
        query.fetchMore({
          variables: {
            lastTimestamp: lastTimestamp,
          },

          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              erc721KnockOffTokens: [
                ...previousResult.erc721KnockOffTokens,
                ...fetchMoreResult.erc721KnockOffTokens,
              ],
            };
          },
        });
      }
    },
  },
};
</script>
