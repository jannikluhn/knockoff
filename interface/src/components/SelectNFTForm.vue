<template>
  <FormulateForm
    v-model="form"
    @submit="submit"
    @input="formErrors = []"
    :form-errors="formErrors"
    #default="{ hasErrors }"
  >
    <FormulateInput
      name="chainID"
      type="select"
      :options="chainSelectOptions"
      label="Chain"
    />
    <FormulateInput
      name="contractAddress"
      type="text"
      validation="required|address"
      label="NFT Contract Address"
      value="0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270"
    />
    <FormulateInput
      name="tokenID"
      type="text"
      validation="required|tokenID"
      label="Token ID"
      value="4000000"
    />
    <FormulateInput
      type="submit"
      name="Find NFT"
      :disabled="hasErrors || validating"
    />
  </FormulateForm>
</template>

<script>
import { chainNames } from "../chains.js";
import {
  makeNFTContractLocation,
  getNFTContractLocationID,
  makeNFTTokenLocation,
  getNFTTokenLocationID,
} from "../nft.js";

export default {
  name: "SelectNFTForm",
  data() {
    return {
      form: null,
      hasErrors: null,
      chainSelectOptions: chainNames,
      formErrors: [],
      validating: false,
    };
  },

  methods: {
    async submit() {
      this.validating = true;

      const nftContractLocation = makeNFTContractLocation(
        this.form.chainID,
        this.form.contractAddress
      );
      const nftContractLocationID = getNFTContractLocationID(
        nftContractLocation
      );
      const nftTokenLocation = makeNFTTokenLocation(
        nftContractLocationID,
        this.form.tokenID
      );
      const nftTokenLocationID = getNFTTokenLocationID(nftTokenLocation);

      if (!this.$store.state.nftContractLocations[nftContractLocationID]) {
        this.$store.commit("insertNFTContract", nftContractLocation);
      }

      if (!this.$store.state.nftContractStates[nftContractLocationID]) {
        try {
          await this.$store.dispatch(
            "fetchNFTContractState",
            nftContractLocationID
          );
        } catch (e) {
          this.formErrors = ["Failed to fetch state of contract."];
          console.error(e);
          this.validating = false;
          return;
        }
      }

      if (!this.$store.state.nftTokenLocations[nftTokenLocationID]) {
        this.$store.commit("insertNFTToken", nftTokenLocation);
      }

      if (!this.$store.state.nftTokenStates[nftTokenLocationID]) {
        try {
          await this.$store.dispatch("fetchNFTTokenState", nftTokenLocationID);
        } catch (e) {
          this.formErrors = ["Failed to fetch token."];
          console.error(e);
          this.validating = false;
          return;
        }
      }

      this.validating = false;
      this.$emit("submit", nftTokenLocationID);
    },
  },
};
</script>
