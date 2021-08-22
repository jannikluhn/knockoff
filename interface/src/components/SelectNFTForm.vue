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
