<template>
  <div class="flex flex-col items-center py-8 xl:flex-row-reverse">
    <p v-if="invalidTokenInputProps">Invalid URL params</p>
    <p v-else-if="requestInProgress">Loading...</p>
    <p v-else-if="contractChainError || tokenChainError">
      Failed to load data from blockchain:
      {{
        contractChainError
          ? contractChainError.message
          : tokenChainError.message
      }}
    </p>
    <p v-else-if="!contractChain.hasCode">The given contract does not exist</p>
    <p v-else-if="!contractChain.supportsIERC721">
      The given contract is not an ERC721 token contract
    </p>
    <p v-else-if="!tokenChain.exists">The requested token does not exist</p>
    <div v-else>
      <p v-if="!contractChain.supportsIERC721">
        The token contract does not have metadata.
      </p>
      <Artwork v-else :metadata="metadata" :error="metadataError" />

      <div class="flex flex-col items-center xl:w-1/2 xl:px-3">
        <Header :isKnockOff="false" :title="title" />
        <NFTDataTable
          :chainID="chainID"
          :contractAddress="contractAddress"
          :tokenID="tokenID"
          :owner="tokenChain.owner"
        />
        <Button :isPrimary="true" message="knock-off" />
      </div>
    </div>
  </div>
</template>

<script>
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import Button from "../components/Button.vue";
import {
  fetchOriginalContractState,
  fetchOriginalTokenState,
  fetchOriginalTokenGraph,
} from "../originalFetching";
import { fetchERC721Metadata } from "../erc721MetadataFetching";
import { isValidAddress, isValidTokenID } from "../validation";
import { pathSegmentToChainID } from "../chains";

export default {
  name: "OriginalPage",
  components: {
    Artwork,
    Header,
    NFTDataTable,
    Button,
  },

  props: ["chain", "contractAddress", "tokenID"],
  data() {
    return {
      contractChain: null,
      tokenChain: null,
      tokenGraph: null,
      metadata: null,
      contractChainError: null,
      tokenChainError: null,
      tokenGraphError: null,
      metadataError: null,

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

    // request status
    requestInProgress() {
      return this.currentRequest !== null;
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

      this.contractChain = null;
      this.tokenChain = null;
      this.tokenGraph = null;
      this.metadata = null;
      this.contractChainError = null;
      this.tokenChainError = null;
      this.tokenGraphError = null;
      this.metadataError = null;

      try {
        if (!this.tokenInputProps) {
          return;
        }

        // fetch contract from chain
        let contractChain = null;
        let contractChainError = null;
        try {
          contractChain = await fetchOriginalContractState(
            this.chainID,
            this.contractAddress
          );
        } catch (e) {
          contractChainError = e;
        }
        if (this.currentRequest !== requestID) {
          return;
        }
        this.contractChain = contractChain;
        this.contractChainError = contractChainError;
        if (this.contractChainError) {
          return;
        }

        // fetch token from chain
        let tokenChain = null;
        let tokenChainError = null;
        try {
          tokenChain = await fetchOriginalTokenState(
            this.chainID,
            this.contractAddress,
            this.tokenID,
            this.contractChain
          );
        } catch (e) {
          tokenChainError = e;
        }
        if (this.currentRequest !== requestID) {
          return;
        }
        this.tokenChain = tokenChain;
        this.tokenChainError = tokenChainError;
        if (this.tokenChainError) {
          return null;
        }

        if (this.contractChain.supportsIERC721 && this.tokenChain.exists) {
          let metadata = null;
          let metadataError = null;
          try {
            metadata = await fetchERC721Metadata(
              this.chainID,
              this.contractAddress,
              this.tokenID
            );
          } catch (e) {
            metadataError = e;
          }
          if (this.currentRequest !== requestID) {
            return;
          }
          this.metadata = metadata;
          this.metadataError = metadataError;
        }

        if (this.tokenChain.exists) {
          let tokenGraph;
          let tokenGraphError;
          try {
            tokenGraph = await fetchOriginalTokenGraph(
              this.chainID,
              this.contractAddress,
              this.tokenID
            );
          } catch (e) {
            tokenGraphError = e;
          }
          if (this.currentRequest !== requestID) {
            return;
          }
          this.tokenGraph = tokenGraph;
          this.tokenGraphError = tokenGraphError;
        }
      } finally {
        this.currentRequest = null;
      }
    },
  },
};
</script>
