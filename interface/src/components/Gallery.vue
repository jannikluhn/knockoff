<template>
  <div>
    <ErrorBox v-if="!fetching && shownTokens.length == 0">
      No tokens found.
    </ErrorBox>
    <div
      class="grid justify-items-center gap-8 m-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="token in shownTokens"
        :key="token.id"
        :token="token"
        :metadata="metadata[token.id]"
      />
      <div
        v-if="showMoreButton && !fetchedAll"
        class="w-full aspect-w-4 aspect-h-5"
      >
        <div class="w-full h-full">
          <div class="aspect-none w-full h-full">
            <div class="w-full h-full flex flex-col justify-center">
              <div class="self-center">
                <Button
                  v-if="!this.fetching"
                  @click="numTokens += 4"
                  :message="'Show more'"
                  :isPrimary="true"
                />
                <BeatLoader v-else color="black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import Card from "./Card.vue";
import Button from "./Button.vue";
import ErrorBox from "./ErrorBox.vue";
import { apolloClients } from "../apollo.js";
import { RecentKnockOffFetcher } from "../recentKnockOffFetcher.js";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";
import { logError } from "../errors.js";

export default {
  name: "Gallery",
  props: ["initialNumTokens", "exactNumTokens", "showMoreButton", "owner"],

  components: {
    Card,
    BeatLoader,
    Button,
    ErrorBox,
  },

  data() {
    return {
      numTokens: 0,
      tokens: [],
      metadata: {},
      fetcher: null,
      fetching: false,
      fetchedAll: false,
    };
  },

  watch: {
    exactNumTokens: {
      immediate: true,
      handler() {
        if (this.exactNumTokens || this.exactNumTokens === 0) {
          this.numTokens = this.exactNumTokens;
        }
      },
    },
    initialNumTokens: {
      immediate: true,
      handler() {
        if (!this.exactNumTokens && this.exactNumTokens !== 0) {
          this.numTokens = Math.max(this.numTokens, this.initialNumTokens);
        }
      },
    },
    numTokens: {
      immediate: true,
      handler() {
        this.fetchTokens();
      },
    },
  },

  computed: {
    shownTokens() {
      return this.tokens.slice(0, this.numTokens);
    },
  },

  mounted() {
    this.fetchTokens();
  },

  methods: {
    async fetchTokens() {
      if (this.fetchedAll || this.fetching) {
        return;
      }
      this.fetching = true;

      if (!this.fetcher) {
        this.fetcher = new RecentKnockOffFetcher(apolloClients, this.owner);
      }

      try {
        while (this.tokens.length < this.numTokens) {
          let moreTokens;
          try {
            moreTokens = await this.fetcher.fetchMore();
          } catch (e) {
            logError("error fetching tokens", e);
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
        logError("error fetching token metadata:", e);
        this.metadata[token.id] = null;
      }
    },
  },
};
</script>
