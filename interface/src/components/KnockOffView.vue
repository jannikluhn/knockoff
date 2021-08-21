<template>
  <div>
    {{ token }}
  </div>
</template>

<script>
import { fetchKnockOffToken } from "../knockOffFetching.js";

export default {
  name: "KnockOffView",
  props: ["chainID", "contractAddress", "tokenID"],

  data() {
    return {
      token: null,
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
      } else {
        this.fetch();
      }
    },

    async fetch() {
      const requestID = this.requestCounter;
      this.currentRequest = requestID;
      this.requestCounter += 1;

      console.log("fetching");
      const token = await fetchKnockOffToken(
        this.chainID,
        this.contractAddress,
        this.tokenID
      );

      if (this.currentRequest !== requestID) {
        return;
      }

      this.token = token;
      this.currentRequest = null;
    },
  },
};
</script>
