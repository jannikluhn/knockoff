<template>
  <p>Knock Off {{ chain }} {{ contractAddress }} {{ tokenID }}</p>
</template>

<script>
export default {
  name: "KnockoffPage",
  props: ["chain", "contractAddress", "tokenID"],
};
</script>
