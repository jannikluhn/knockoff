<template>
  <p>Original {{ chain }} {{ contractAddress }} {{ tokenID }}</p>
</template>

<script>
export default {
  name: "OriginalPage",
  props: ["chain", "contractAddress", "tokenID"],
};
</script>
