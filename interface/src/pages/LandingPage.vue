<template>
  <div class="flex flex-col items-center py-5 sm:p-10">
    <h1 class="text-5xl sm:text-7xl sm:w-2/3 font-extrabold italic text-center">
      Get your NFT <br />
      knock-off now
    </h1>
    <SelectNFTForm @submit="nftTokenLocationID = $event" />
  </div>
</template>

<script>
import SelectNFTForm from "../components/SelectNFTForm.vue";

export default {
  name: "LandingPage",
  components: {
    SelectNFTForm,
  },
};
</script>
