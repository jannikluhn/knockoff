<template>
  <table class="table-fixed mx-auto">
    <tbody>
      <tr v-for="row in tableRows" :key="row.label">
        <th class="text-left w-1/2" v-if="row.value !== null">
          {{ row.label }}
        </th>
        <td class="font-medium capitalize text-right" v-if="row.value !== null">
          {{ row.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { chainNames } from "../chains.js";
import {
  formatTimestampAsDate,
  formatTokenID,
  formatAddress,
} from "../formatting.js";

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
        { label: "Chain", value: this.chain },
        {
          label: "Contract address",
          value: formatAddress(this.contractAddress),
        },
        { label: "Token ID", value: formatTokenID(this.tokenID) },
        { label: "Owner", value: formatAddress(this.owner) },
        { label: "Mint date", value: this.mintDateString },
      ];
    },
  },
};
</script>
