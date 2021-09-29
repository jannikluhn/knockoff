<template>
  <div>
    <div
      class="sm:mix-blend-difference sm:text-white relative md:w-2/3 mx-auto text-center"
    >
      <h1 class=" px-4 md:px-9 pt-6 md:pt-20 text-3xl sm:text-6xl font-extrabold italic">
        Are you too poor for NFTs???
        <br />
        Get a knockoff!!!
      </h1>
    </div>

    <div class=" relative pt-8">
      <SelectNFTForm @submit="nftTokenLocationID = $event" />
    </div>
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
