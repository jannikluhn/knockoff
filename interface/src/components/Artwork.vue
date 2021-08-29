<template>
  <div class="xl:w-1/2">
    <p v-if="error">
      {{ error.message }}
    </p>
    <p v-else-if="!srcURL">
      Metadata does not contain image URL
    </p>

    <p v-else>
      <img
        class="object-contain object-center"
        :src="srcURL"
        alt="NFT Artwork"
      />
    </p>
  </div>
</template>

<script>
export default {
  name: "Artwork",
  props: ["metadata", "error"],

  computed: {
    srcURL() {
      if (this.metadata) {
        return this.metadata["image"];
      }
      return null;
    },
  },
};
</script>
