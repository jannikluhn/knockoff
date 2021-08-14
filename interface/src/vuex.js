import Vue from "vue";
import Vuex from "vuex";
import {
  getNFTContractLocationID,
  fetchNFTContractState,
  getNFTTokenLocationID,
  fetchNFTTokenState,
  joinNFTTokenState,
  fetchERC721JSON,
} from "./nft.js";
import { providers } from "./chains.js";
import errors from "./errors.js";
import { ethers } from "ethers";

let store = null;

function setupVuex() {
  Vue.use(Vuex);

  store = new Vuex.Store({
    strict: true,

    state: {
      nftContractLocations: {},
      nftContractStates: {},
      nftTokenLocations: {},
      nftTokenStates: {},

      erc721JSONs: {},
    },

    getters: {
      joinedNFTTokenState: (state) => (nftTokenLocationID) => {
        const nftTokenLocation = state.nftTokenLocations[nftTokenLocationID];
        if (!nftTokenLocation) {
          ethers.logger.throwError(
            "NFT token location not in store",
            errors.BAD_STORE
          );
        }
        const nftContractLocationID = nftTokenLocation.nftContractLocationID;
        const nftContractLocation =
          state.nftContractLocations[nftContractLocationID];
        if (!nftContractLocation) {
          ethers.logger.throwError(
            "NFT contract location not in store",
            errors.BAD_STORE
          );
        }

        const nftTokenState = state.nftTokenStates[nftTokenLocationID];
        if (!nftTokenLocation) {
          ethers.logger.throwError(
            "NFT token state not in store",
            errors.BAD_STORE
          );
        }
        const nftContractState = state.nftContractStates[nftContractLocationID];
        if (!nftTokenLocation) {
          ethers.logger.throwError(
            "NFT contract state not in store",
            errors.BAD_STORE
          );
        }

        return joinNFTTokenState(
          nftTokenLocation,
          nftTokenState,
          nftContractLocation,
          nftContractState
        );
      },
    },

    mutations: {
      insertNFTContract(state, nftContractLocation) {
        const id = getNFTContractLocationID(nftContractLocation);
        Vue.set(state.nftContractLocations, id, nftContractLocation);
      },

      setNFTContractState(state, { nftContractLocationID, nftContractState }) {
        Vue.set(
          state.nftContractStates,
          nftContractLocationID,
          nftContractState
        );
      },

      insertNFTToken(state, nftTokenLocation) {
        const id = getNFTTokenLocationID(nftTokenLocation);
        Vue.set(state.nftTokenLocations, id, nftTokenLocation);
      },

      setNFTTokenState(state, { nftTokenLocationID, nftTokenState }) {
        Vue.set(state.nftTokenStates, nftTokenLocationID, nftTokenState);
      },

      setERC721JSON(state, { nftTokenLocationID, json }) {
        Vue.set(state.erc721JSONs, nftTokenLocationID, json);
      },
    },

    actions: {
      async fetchNFTContractState({ state, commit }, nftContractLocationID) {
        const nftContractLocation =
          state.nftContractLocations[nftContractLocationID];
        if (!nftContractLocation) {
          ethers.logger.throwError(
            "NFT contract location not in store",
            errors.BAD_STORE
          );
        }

        const nftContractState = await fetchNFTContractState(
          nftContractLocation,
          providers
        );
        commit("setNFTContractState", {
          nftContractLocationID: nftContractLocationID,
          nftContractState: nftContractState,
        });
      },

      async fetchNFTTokenState({ state, commit }, nftTokenLocationID) {
        const nftTokenLocation = state.nftTokenLocations[nftTokenLocationID];
        if (!nftTokenLocation) {
          ethers.logger.throwError(
            "NFT token location not in store",
            errors.BAD_STORE
          );
        }
        const nftContractLocationID = nftTokenLocation.nftContractLocationID;
        const nftContractLocation =
          state.nftContractLocations[nftContractLocationID];
        if (!nftContractLocation) {
          ethers.logger.throwError(
            "NFT contract location not in store",
            errors.BAD_STORE
          );
        }
        const nftContractState = state.nftContractStates[nftContractLocationID];
        if (!nftContractState) {
          ethers.logger.throwError(
            "NFT contract state not in store",
            errors.BAD_STORE
          );
        }

        const nftTokenState = await fetchNFTTokenState(
          nftTokenLocation,
          nftContractLocation,
          nftContractState,
          providers
        );
        commit("setNFTTokenState", {
          nftTokenLocationID: nftTokenLocationID,
          nftTokenState: nftTokenState,
        });
      },

      async fetchERC721JSON({ getters, commit }, nftTokenLocationID) {
        const joinedNFTTokenState = getters.joinedNFTTokenState(
          nftTokenLocationID
        );
        const json = await fetchERC721JSON(joinedNFTTokenState);
        commit("setERC721JSON", {
          nftTokenLocationID: nftTokenLocationID,
          json: json,
        });
      },
    },
  });
}

export { setupVuex, store };
