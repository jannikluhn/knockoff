<template>
  <FormulateForm
    v-model="form"
    @submit="submit"
    @input="formErrors = []"
    :form-errors="formErrors"
    #default="{ hasErrors }"
    class="my-12"
  >
    <FormulateInput
      name="chainID"
      type="select"
      :options="chainSelectOptions"
      input-class="w-full sm:w-64 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      name="contractAddress"
      type="text"
      validation="required|address"
      placeholder="Enter NFT Contract Address"
      input-class="w-full sm:w-64 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      name="tokenID"
      type="text"
      validation="required|tokenID"
      placeholder="Enter Token ID"
      input-class="w-full sm:w-64 mt-2 px-4 py-1 rounded-full border-2 border-black font-medium capitalize"
    />
    <FormulateInput
      type="submit"
      name="Find NFT"
      :disabled="hasErrors || validating"
      input-class="w-full sm:w-64 mt-2 px-4 py-1 rounded-full border-2 border-black text-white uppercase bg-black font-bold"
    />
  </FormulateForm>
</template>

<script>
import { chainNames } from "../chains.js";

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
    async submit() {},
  },
};
</script>
