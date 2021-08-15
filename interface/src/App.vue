<template>
  <div id="app">
    <SelectNFTForm @submit="nftTokenLocationID = $event" />
    <NFTView :nftTokenLocationID="nftTokenLocationID" />
    <Gallery />
  </div>
</template>

<script>
import SelectNFTForm from "./components/SelectNFTForm.vue";
import NFTView from "./components/NFTView.vue";
import Gallery from "./components/Gallery.vue";

export default {
  name: "App",
  components: {
    SelectNFTForm,
    NFTView,
    Gallery,
  },

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
