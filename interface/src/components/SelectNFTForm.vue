<template>
  <FormulateForm
    v-model="form"
    @submit="submit"
    @input="formErrors = []"
    :form-errors="formErrors"
    #default="{ hasErrors }"
    class="w-full sm:w-96 my-12 mx-auto"
  >
    <FormulateInput
      name="chainID"
      type="select"
      :options="chainSelectOptions"
      input-class="w-full sm:w-96 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      name="contractAddress"
      type="text"
      validation="required|address"
      placeholder="Enter NFT Contract Address"
      input-class="w-full sm:w-96 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      name="tokenID"
      type="text"
      validation="required|tokenID"
      placeholder="Enter Token ID"
      input-class="w-full sm:w-96 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      type="submit"
      name="Find NFT"
      :disabled="hasErrors || validating"
      input-class="w-full sm:w-96 mt-2 px-4 py-1 rounded-full border-2 border-black text-white uppercase bg-black font-bold"
    />
  </FormulateForm>
</template>

<script>
import { chainNames, chainIDToPathSegment } from "../chains.js";
import { ethers } from "ethers";

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
      this.$router.push({
        name: "original",
        params: {
          chain: chainIDToPathSegment(this.form.chainID),
          contractAddress: ethers.utils.getAddress(this.form.contractAddress),
          tokenID: ethers.BigNumber.from(this.form.tokenID).toString(),
        },
      });
    },
  },
};
</script>
