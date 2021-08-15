<template>
  <div id="app">
    <SelectNFTForm @submit="nftTokenLocationID = $event" />
    <NFTView :nftTokenLocationID="nftTokenLocationID" />
    <Gallery />

    <div
      class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4"
    >
      <div class="flex-shrink-0">
        <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
      </div>
      <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-500">You have a new message!</p>
      </div>
    </div>
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
