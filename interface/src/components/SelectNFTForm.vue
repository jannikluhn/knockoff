<template>
  <FormulateForm
    v-model="form"
    @submit="submit"
    @input="formErrors = []"
    :form-errors="formErrors"
    #default="{ hasErrors }"
    class="w-full max-w-lg space-y-2 mx-auto"
  >
    <FormulateInput
      name="chainID"
      type="select"
      :options="chainSelectOptions"
      input-class="w-full px-2 py-1 rounded-full border-2 border-black focus:ring-1 focus:ring-black"
    />
    <FormulateInput
      name="contractAddress"
      type="text"
      validation="bail|required|address"
      validationName="contract address"
      placeholder="Original NFT Contract Address"
      input-class="w-full px-3 py-1 rounded-full border-2 border-black focus:ring-1 focus:ring-black"
      errors-class="px-5 pt-2"
    />
    <FormulateInput
      name="tokenID"
      type="text"
      validation="bail|required|tokenID"
      validationName="token ID"
      placeholder="Original NFT Token ID"
      input-class="w-full px-3 py-1 rounded-full border-2 border-black focus:ring-1 focus:ring-black"
      errors-class="px-5 pt-2"
    />
    <FormulateInput
      type="submit"
      name="Show NFT!!!"
      :disabled="hasErrors || validating"
      input-class="w-full py-1 px-10 rounded-full border-2 border-black text-white bg-black font-bold"
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
