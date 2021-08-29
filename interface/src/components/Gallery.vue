<template>
  <div
    class="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 justify-items-center"
  >
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
  </div>
</template>

<script>
import Card from "./Card.vue";
import { apolloClients } from "../apollo.js";
import { RecentKnockOffFetcher } from "../recentKnockOffFetcher.js";
// import { fetchERC721Metadata } from "../erc721MetadataFetching.js";

export default {
  name: "Gallery",

  components: {
    Card,
  },

  data() {
    return {
      tokens: [],
      requestInProgress: false,
    };
  },

  created() {
    this.fetcher = new RecentKnockOffFetcher(apolloClients);
  },

  async mounted() {
    await this.fetchMore();
  },

  methods: {
    async fetchMore() {
      this.requestInProgress = true;
      try {
        const moreTokens = await this.fetcher.fetchMore();

        for (const token of moreTokens) {
          this.tokens.push(token);
          this.fetchERC721MetadataFor(token); // run in background
        }
      } finally {
        this.requestInProgress = false;
      }
    },

    async fetchERC721MetadataFor() {
      // TODO: token doesn't contain these fields at the moment
      // const json = await fetchERC721Metadata(
      //   token.chainID,
      //   token.contractAddress,
      //   token.tokenID
      // );
    },
  },
};
</script>
