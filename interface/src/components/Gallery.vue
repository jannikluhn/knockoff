<template>
  <div
    class="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 justify-items-center"
  >
    <Card
      v-for="token in tokens"
      :key="token.id"
      :metadata="metadata[token.id]"
      :mintTimestamp="token.mintTimestamp"
      :serialNumber="token.serialNumber"
    />
  </div>
</template>

<script>
import Card from "./Card.vue";
import { apolloClients } from "../apollo.js";
import { RecentKnockOffFetcher } from "../recentKnockOffFetcher.js";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";

export default {
  name: "Gallery",
  props: ["maxTokens"],

  components: {
    Card,
  },

  data() {
    return {
      tokens: [],
      metadata: {},
      fetcher: null,
      fetching: false,
    };
  },

  watch: {
    maxTokens: {
      immediate: true,
      handler() {
        if (!this.fetching) {
          this.fetchTokens();
        }
      },
    },
  },

  methods: {
    async fetchTokens() {
      if (this.fetchedAll || this.fetching) {
        return;
      }
      this.fetching = true;

      if (!this.fetcher) {
        this.fetcher = new RecentKnockOffFetcher(apolloClients);
      }

      try {
        for (;;) {
          let moreTokens;
          try {
            moreTokens = await this.fetcher.fetchMore();
          } catch (e) {
            console.error("error fetching tokens", e.message, e.obj);
            return;
          }

          for (const token of moreTokens) {
            this.tokens.push(token);
            this.fetchERC721MetadataFor(token); // run in background
          }

          if (moreTokens.length == 0) {
            this.fetchedAll = true;
            return;
          }
          if (this.tokens.length >= this.maxTokens) {
            return;
          }
        }
      } finally {
        this.fetching = false;
      }
    },

    async fetchERC721MetadataFor(token) {
      try {
        const metadata = await fetchERC721Metadata(
          token.contract.chainID,
          token.contract.address,
          token.tokenID
        );
        this.$set(this.metadata, token.id, metadata);
      } catch (e) {
        console.error("error fetching token metadata:", e.message, e.obj);
        this.metadata[token.id] = null;
      }
    },
  },
};
</script>
