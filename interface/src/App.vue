<template>
  <div id="app">
    <SelectNFTForm @submit="nftTokenLocationID = $event" />
    <NFTView :nftTokenLocationID="nftTokenLocationID" />
  </div>
</template>

<script>
import SelectNFTForm from "./components/SelectNFTForm.vue";
import NFTView from "./components/NFTView.vue";

export default {
  name: "App",
  components: {
    SelectNFTForm,
    NFTView,
  },

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
