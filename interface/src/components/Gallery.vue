<template>
  <div>
    <p>Gallery</p>
    <p>
      {{ tokens }}
    </p>
    <button @click="fetchMore" :disabled="requestInProgress">Fetch More</button>
  </div>
</template>

<script>
import { apolloClients } from "../apollo.js";
import { RecentERC721KnockOffFetcher } from "../recentERC721KnockOffFetcher.js";

export default {
  name: "Gallery",

  data() {
    return {
      tokens: [],
      requestInProgress: false,
    };
  },

  created() {
    this.fetcher = new RecentERC721KnockOffFetcher(apolloClients);
  },

  async mounted() {
    await this.fetchMore();
  },

  methods: {
    async fetchMore() {
      this.requestInProgress = true;
      try {
        const moreTokens = await this.fetcher.fetchMore();
        this.tokens.push(...moreTokens);
      } finally {
        this.requestInProgress = false;
      }
    },
  },
};
</script>
