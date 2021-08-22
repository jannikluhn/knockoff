<template>
  <div>
    {{ token }}
    {{ metadata }}
    <p v-if="tokenFetchingFailed">Token fetching failed</p>
    <p v-if="metadataFetchingFailed">Metadata fetching failed</p>
  </div>
</template>

<script>
import { fetchKnockOffToken } from "../knockOffFetching.js";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";

export default {
  name: "KnockOffView",
  props: ["chainID", "contractAddress", "tokenID"],

  data() {
    return {
      token: null,
      metadata: null,

      requestCounter: 0,
      currentRequest: null,
    };
  },

  computed: {
    requestInProgress() {
      return this.currentRequest !== null;
    },
    tokenInputProps() {
      if (!this.chainID || !this.contractAddress || !this.tokenID) {
        return null;
      }
      return [this.chainID, this.contractAddress, this.tokenID];
    },
    tokenFetchingFailed() {
      return !this.requestInProgress && !this.token;
    },
    metadataFetchingFailed() {
      return !this.requestInProgress && !this.metadata;
    },
  },

  watch: {
    tokenInputProps: {
      immediate: true,
      handler() {
        this.tokenChangeHandler();
      },
    },
  },

  methods: {
    tokenChangeHandler() {
      if (!this.tokenInputProps) {
        this.token = null;
        this.metadata = null;
      } else {
        this.fetch();
      }
    },

    async fetch() {
      const requestID = this.requestCounter;
      this.currentRequest = requestID;
      this.requestCounter += 1;

      this.token = null;
      this.metadata = null;

      try {
        const token = await fetchKnockOffToken(
          this.chainID,
          this.contractAddress,
          this.tokenID
        );
        if (this.currentRequest !== requestID) {
          return;
        }
        this.token = token;

        if (this.token) {
          const metadata = await fetchERC721Metadata(
            token.contract.chainID,
            token.contract.address,
            token.tokenID
          );
          if (this.currentRequest !== requestID) {
            return;
          }
          this.metadata = metadata;
        }
      } finally {
        if (this.currentRequest === requestID) {
          this.currentRequest = null;
        }
      }
    },
  },
};
</script>
