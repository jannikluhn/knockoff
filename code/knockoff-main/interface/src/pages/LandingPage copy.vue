<template>
  <div class="space-y-20 pb-12">
    <div class="flex justify-start">
      <div class="md:w-2/3">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-center font-thin">
          Too poor for NFTs?
        </h1>
        <h1 class="text-5xl sm:text-7xl font-extrabold italic text-center">
          MAKE A <br />
          KNOCK-OFF!!!
        </h1>
      </div>
    </div>

    <div class="flex justify-end">
      <div class="md:w-2/3">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-center">
          Does the idea of <span class="italic">digitally rare</span> art cause you existential dread?
        </h1>
        <h1 class="text-5xl sm:text-7xl font-extrabold italic text-center">
          MAKE A <br />
          KNOCK-OFF!!!
        </h1>
      </div>
    </div>

    <div class="flex justify-start">
      <div class="md:w-2/3">
        <h1 class="text-3xl sm:text-5xl font-extrabold text-center">
          Is your favorite cryptokitty not for sale?
        </h1>
        <h1 class="text-5xl sm:text-7xl font-extrabold italic text-center">
          MAKE A <br />
          KNOCK-OFF!!!
        </h1>
      </div>
    </div>

    <div class="pt-16">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-center">
        Mint your own knock-off NOW in just
      </h1>
      <h1 class="mb-10 text-5xl sm:text-7xl font-extrabold italic text-center">
        THREE SIMPLE STEPS!!!
      </h1>
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
