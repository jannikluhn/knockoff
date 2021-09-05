<template>
  <div class="flex flex-col items-center py-8 xl:flex-row-reverse">
    <p v-if="invalidTokenInputProps">Invalid URL params</p>
    <p v-else-if="requestInProgress">Loading token...</p>
    <p v-else-if="tokenFetchError">
      {{ tokenFetchError.message }}
    </p>
    <p v-else-if="!token">Token not found</p>
    <div v-else>
      <Artwork :metadata="metadata" :error="metadataFetchError" />
      <div class="flex flex-col items-center xl:w-1/2 xl:px-3">
        <Header
          :isKnockOff="true"
          :title="title"
          :serialNumber="token.serialNumber"
        />
        <NFTDataTable
          :chainID="chainID"
          :contractAddress="contractAddress"
          :tokenID="tokenID"
          :owner="token.owner"
          :mintTimestamp="token.mintTimestamp"
        />
        <KnockOffCreator
          :chainID="chainID"
          :contractAddress="contractAddress"
          :tokenID="tokenID"
        />
        <router-link :to="originalLink">View Original</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import KnockOffCreator from "../components/KnockOffCreator.vue";
import { pathSegmentToChainID, chainIDToPathSegment } from "../chains";
import { fetchKnockOffToken } from "../knockOffFetching.js";
import { fetchERC721Metadata } from "../erc721MetadataFetching.js";
import { isValidAddress, isValidTokenID } from "../validation.js";
import { logError } from "../errors.js";

export default {
  name: "KnockoffPage",

  components: {
    Artwork,
    Header,
    NFTDataTable,
    KnockOffCreator,
  },
  props: ["chain", "contractAddress", "tokenID"],

  data() {
    return {
      token: null,
      metadata: null,
      tokenFetchError: null,
      metadataFetchError: null,

      requestCounter: 0,
      currentRequest: null,
    };
  },

  computed: {
    // URL param validation
    chainID() {
      return pathSegmentToChainID(this.chain);
    },
    unknownChain() {
      return !this.chainID;
    },
    invalidContractAddress() {
      return !isValidAddress(this.contractAddress);
    },
    invalidTokenID() {
      return !isValidTokenID(this.tokenID);
    },
    invalidTokenInputProps() {
      return (
        this.unknownChain || this.invalidContractAddress || this.invalidTokenID
      );
    },
    tokenInputProps() {
      if (this.invalidTokenInputProps) {
        return null;
      }
      return [this.chainID, this.contractAddress, this.tokenID];
    },
    originalLink() {
      if (!this.invalidTokenInputProps) {
        return {
          name: "original",
          params: {
            chain: chainIDToPathSegment(this.chainID),
            contractAddress: ethers.utils.getAddress(this.contractAddress),
            tokenID: ethers.BigNumber.from(this.tokenID).toString(),
          },
        };
      }
      return null;
    },

    // request status
    requestInProgress() {
      return this.currentRequest !== null;
    },
    tokenFetchingFailed() {
      return (
        !this.invalidTokenInputProps && !this.requestInProgress && !this.token
      );
    },
    metadataFetchingFailed() {
      return (
        !this.invalidTokenInputProps &&
        !this.requestInProgress &&
        !this.metadata
      );
    },

    title() {
      if (this.metadata) {
        return this.metadata["name"];
      }
      return "Unknown Title";
    },
  },

  watch: {
    tokenInputProps: {
      immediate: true,
      handler() {
        this.fetchToken();
      },
    },
  },

  methods: {
    async fetchToken() {
      const requestID = this.requestCounter;
      this.currentRequest = requestID;
      this.requestCounter += 1;

      this.token = null;
      this.metadata = null;
      this.tokenFetchError = null;
      this.metadataFetchError = null;

      try {
        if (!this.tokenInputProps) {
          return;
        }

        let token = null;
        let tokenFetchError = null;
        try {
          token = await fetchKnockOffToken(
            this.chainID,
            this.contractAddress,
            this.tokenID
          );
        } catch (e) {
          logError("failed to fetch token", e);
          tokenFetchError = e;
        }
        if (this.currentRequest !== requestID) {
          return;
        }
        this.token = token;
        this.tokenFetchError = tokenFetchError;

        if (this.token) {
          let metadata;
          let metadataFetchError;
          try {
            metadata = await fetchERC721Metadata(
              token.contract.chainID,
              token.contract.address,
              token.tokenID
            );
          } catch (e) {
            logError("failed to fetch token metadata", e);
            metadataFetchError = e;
          }
          if (this.currentRequest !== requestID) {
            return;
          }
          this.metadata = metadata;
          this.metadataFetchError = metadataFetchError;
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
