<template>
  <div>
    <button @click="fetch">Fetch</button>
  </div>
</template>

<script>
import { fetchKnockOffToken } from "../knockOffFetching.js";

export default {
  name: "KnockOffView",
  params: ["chainID", "contractAddress", "tokenID"],

  data() {
    return {
      token: null,
    };
  },

  methods: {
    async fetch() {
      console.log("fetching");
      const result = await fetchKnockOffToken(
        5,
        "0xe62e83ab3dc95ac696ad3fa0bf16d4f93c6bbbc9",
        "92655958585409148180944849191391429004953733686230621928396462488157034647999"
      );
      console.log(result);
    },
  },
};
</script>
