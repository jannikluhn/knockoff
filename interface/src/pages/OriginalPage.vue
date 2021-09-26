<template>
  <div>
    <ErrorBox v-if="invalidTokenInputProps">
      Invalid token URL.
    </ErrorBox>
    <div v-else-if="requestInProgress" class="pt-8 flex justify-center">
      <BeatLoader color="black" />
    </div>
    <ErrorBox
      v-else-if="contractChainError || tokenChainError || tokenAsKnockOffError"
    >
      Failed to load data from the blockchain:
      {{
        contractChainError
          ? contractChainError.message
          : tokenChainError
          ? tokenChainError.message
          : tokenAsKnockOffError.message
      }}
    </ErrorBox>
    <ErrorBox v-else-if="!contractChain.hasCode">
      No contract was found at the given address.
    </ErrorBox>
    <ErrorBox v-else-if="!contractChain.supportsIERC721">
      The given contract is not ERC721 compatible. For now, only these NFTs can
      be knocked off.
    </ErrorBox>
    <ErrorBox v-else-if="!tokenChain.exists">
      Token not found.
    </ErrorBox>

    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 justify-center gap-8 pb-4">
        <div class="flex flex-col justify-end lg:justify-center">
          <ErrorBox v-if="!contractChain.supportsIERC721">
            The token does not have any metadata.
          </ErrorBox>
          <Artwork v-else :metadata="metadata" :error="metadataError" />
        </div>

        <div class="flex flex-col justify-center gap-y-8">
          <Header
            :isKnockOff="isKnockOff"
            :serialNumber="knockOffSerialNumber"
            :ancestorSerialNumbers="knockOffAncestorSerialNumbers"
            :title="title"
          />
          <NFTDataTable
            :chainID="chainID"
            :contractAddress="contractAddress"
            :tokenID="tokenID"
            :owner="tokenChain.owner"
          />
          <KnockOffCreator
            :chainID="chainID"
            :contractAddress="contractAddress"
            :tokenID="tokenID"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import ErrorBox from "../components/ErrorBox.vue";
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import KnockOffCreator from "../components/KnockOffCreator.vue";
import {
  fetchOriginalContractState,
  fetchOriginalTokenState,
  fetchOriginalTokenGraph,
} from "../originalFetching";
import { fetchERC721Metadata } from "../erc721MetadataFetching";
import { isValidAddress, isValidTokenID } from "../validation";
import { pathSegmentToChainID } from "../chains";
import { fetchKnockOffToken } from "../knockOffFetching";

export default {
  name: "OriginalPage",
  components: {
    BeatLoader,
    ErrorBox,
    Artwork,
    Header,
    NFTDataTable,
    KnockOffCreator,
  },

  props: ["chain", "contractAddress", "tokenID"],
  data() {
    return {
      contractChain: null,
      tokenChain: null,
      tokenGraph: null,
      metadata: null,
      tokenAsKnockOff: null,
      contractChainError: null,
      tokenChainError: null,
      tokenGraphError: null,
      metadataError: null,
      tokenAsKnockOffError: null,

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

    isKnockOff() {
      return this.tokenAsKnockOff !== null;
    },
    knockOffSerialNumber() {
      if (!this.tokenAsKnockOff) {
        return null;
      }
      return this.tokenAsKnockOff.serialNumber;
    },
    knockOffAncestorSerialNumbers() {
      if (!this.tokenAsKnockOff) {
        return null;
      }
      return this.tokenAsKnockOff.ancestorSerialNumbers;
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
      this.tokenAsKnockOff = null;
      this.contractChainError = null;
      this.tokenChainError = null;
      this.tokenGraphError = null;
      this.metadataError = null;
      this.tokenAsKnockOffError = null;

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

          let tokenAsKnockOff;
          let tokenAsKnockOffError;
          try {
            tokenAsKnockOff = await fetchKnockOffToken(
              this.chainID,
              this.contractAddress,
              this.tokenID
            );
          } catch (e) {
            tokenAsKnockOffError = e;
          }
          if (this.currentRequest !== requestID) {
            return;
          }
          this.tokenAsKnockOff = tokenAsKnockOff;
          this.tokenAsKnockOffError = tokenAsKnockOffError;
        }
      } finally {
        this.currentRequest = null;
      }
    },
  },
};
</script>
