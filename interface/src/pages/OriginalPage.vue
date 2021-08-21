<template>
<div>
  <Artwork />
  <Header />
  <NFTDataTable />
  <Button :isPrimary="true" />
  <p>Original {{ chain }} {{ contractAddress }} {{ tokenID }}</p>
</div>
</template>

<script>
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import Button from "../components/Button.vue";

export default {
  name: "OriginalPage",

  components: {
    Artwork,
    Header,
    NFTDataTable,
    Button
  },
  
  props: ["chain", "contractAddress", "tokenID"],
};
</script>
