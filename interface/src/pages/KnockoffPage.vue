<template>
  <div class="flex flex-col items-center py-8 xl:flex-row-reverse">
    <Artwork />
    <div class="flex flex-col items-center xl:w-1/2 xl:px-3">
      <Header />
      <NFTDataTable
        :chainID="chainID"
        :contractAddress="contractAddress"
        :tokenID="tokenID"
        :owner="token.owner"
        :mintTimestamp="token.mintTimestamp"
      />
      <Button :isPrimary="true" message="knock-off" />
      <Button :isPrimary="false" message="view original" />
    </div>
  </div>
</template>

<script>
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import Button from "../components/Button.vue";
import { pathSegmentToChainID } from "../chains";
import { fetchKnockOffToken } from "../knockOffFetching.js";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";

export default {
  name: "KnockoffPage",

  components: {
    Artwork,
    Header,
    NFTDataTable,
    Button,
  },
  props: ["chain", "contractAddress", "tokenID"],

  data() {
    return {
      token: null,
      metadata: null,

      requestCounter: 0,
      currentRequest: null,
    };
  },

  computed: {
    chainID() {
      return pathSegmentToChainID(this.chain);
    },
    unknownChain() {
      return !this.chainID;
    },
    requestInProgress() {
      return this.currentRequest !== null;
    },
    tokenInputProps() {
      if (
        this.unknownChain ||
        !this.chainID ||
        !this.contractAddress ||
        !this.tokenID
      ) {
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
