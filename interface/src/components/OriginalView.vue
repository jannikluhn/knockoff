<template>
  <div>
    <p>{{ contractState }}</p>
    <p>{{ tokenState }}</p>
    <p>{{ tokenGraph ? tokenGraph : "not indexed" }}</p>
    <p>{{ metadata }}</p>
  </div>
</template>

<script>
import {
  fetchOriginalContractState,
  fetchOriginalTokenState,
  fetchOriginalTokenGraph,
} from "../originalFetching";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";

export default {
  name: "OriginalView",
  props: ["chainID", "contractAddress", "tokenID"],

  data() {
    return {
      requestCounter: 0,

      contractState: null,
      tokenState: null,
      tokenGraph: null,
      metadata: null,
    };
  },

  computed: {
    tokenInputProps() {
      if (!this.chainID || !this.contractAddress || !this.tokenID) {
        return null;
      }
      return [this.chainID, this.contractAddress, this.tokenID];
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
        this.contractState = null;
        this.tokenState = null;
        this.tokenGraph = null;
        this.metadata = null;
      } else {
        this.fetch();
      }
    },

    async fetch() {
      const requestID = this.requestCounter;
      this.currentRequest = requestID;
      this.requestCounter += 1;

      this.contractState = null;
      this.tokenState = null;
      this.tokenGraph = null;
      this.metadata = null;

      try {
        const contractState = await fetchOriginalContractState(
          this.chainID,
          this.contractAddress
        );
        if (this.currentRequest !== requestID) {
          return;
        }
        this.contractState = contractState;

        const tokenState = await fetchOriginalTokenState(
          this.chainID,
          this.contractAddress,
          this.tokenID,
          this.contractState
        );
        if (this.currentRequest !== requestID) {
          return;
        }
        this.tokenState = tokenState;

        if (this.contractState.supportsIERC721 && this.tokenState.exists) {
          const metadata = await fetchERC721Metadata(
            this.chainID,
            this.contractAddress,
            this.tokenID
          );
          if (this.currentRequest !== requestID) {
            return;
          }
          this.metadata = metadata;
        }

        if (this.tokenState.exists) {
          const tokenGraph = await fetchOriginalTokenGraph(
            this.chainID,
            this.contractAddress,
            this.tokenID
          );
          if (this.currentRequest !== requestID) {
            return;
          }
          this.tokenGraph = tokenGraph;
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
