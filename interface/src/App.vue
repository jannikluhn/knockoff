<template>
  <div id="app" class="px-5 bg-gray-50 sm:px-20 md:px-40 xl:px-52">
    <SelectNFTForm @submit="nftTokenLocationID = $event" />
    <NFTView :nftTokenLocationID="nftTokenLocationID" />
    <Gallery />

    <router-link to="/">Landing</router-link>
    <router-link to="/gallery">Gallery</router-link>
    <router-link to="/original/ethereum/0xaabbcc/123">Original</router-link>
    <router-link to="/knockoff/ethereum/0xffeedd/321">Knock Off</router-link>

    <router-view></router-view>
    <Card />
  </div>
</template>

<script>
import SelectNFTForm from "./components/SelectNFTForm.vue";
import NFTView from "./components/NFTView.vue";
import Gallery from "./components/Gallery.vue";
import Card from "./components/Card.vue";

export default {
  name: "App",
  components: {
    SelectNFTForm,
    NFTView,
    Gallery,
    Card,
  },

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
