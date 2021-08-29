<template>
  <table class="table-auto w-full my-4 mx-auto sm:w-72">
    <tr v-for="row in tableRows" :key="row.label">
      <td class="uppercase text-left" v-if="row.value !== null">
        {{ row.label }}
      </td>
      <td class="font-medium capitalize text-right" v-if="row.value !== null">
        {{ row.value }}
      </td>
    </tr>
  </table>
</template>

<script>
import { chainNames } from "../chains.js";
import { formatTimestampAsDate } from "../formatting.js";

export default {
  name: "NFTDataTable",
  props: ["chainID", "contractAddress", "tokenID", "owner", "mintTimestamp"],

  computed: {
    chain() {
      if (!this.chainID) {
        return null;
      }
      return chainNames[this.chainID];
    },
    mintDateString() {
      if (!this.mintTimestamp) {
        return null;
      }
      return formatTimestampAsDate(this.mintTimestamp);
    },

    tableRows() {
      return [
        { label: "chain", value: this.chain },
        { label: "contract address", value: this.contractAddress },
        { label: "token id", value: this.tokenID },
        { label: "owner", value: this.owner },
        { label: "mint date", value: this.mintDateString },
      ];
    },
  },
};
</script>
