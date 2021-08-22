<template>
  <div class="flex flex-col items-center py-8 xl:flex-row-reverse">
    <Artwork />
    <div class="flex flex-col items-center xl:w-1/2 xl:px-3">
      <Header />
      <NFTDataTable />
      <Button :isPrimary="true" message="knock-off" />
      <Button :isPrimary="false" message="view original" />
    </div>
  </div>
</template>

<script>
import Artwork from "../components/Artwork.vue";
import Header from "../components/Header.vue";
import NFTDataTable from "../components/NFTDataTable.vue";
import Button from "../components/Button.vue";
import { pathSegmentToChainID } from "../chains";

export default {
  name: "KnockoffPage",

  components: {
    Artwork,
    Header,
    NFTDataTable,
    Button,
  },
  props: ["chain", "contractAddress", "tokenID"],

  computed: {
    chainID() {
      return pathSegmentToChainID(this.chain);
    },
    unknownChain() {
      return !this.chainID;
    },
  },
};
</script>
