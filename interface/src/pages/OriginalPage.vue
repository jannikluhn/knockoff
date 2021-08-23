<template>
  <div class="flex flex-col items-center py-8 xl:flex-row-reverse">
    <Artwork />
    <div class="flex flex-col items-center xl:w-1/2 xl:px-3">
      <Header />
      <NFTDataTable />
      <Button :isPrimary="true" message="knock-off" />
    </div>
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
    Button,
  },
};
</script>
