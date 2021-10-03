<template>
  <div>
    <ErrorBox v-if="error">
      {{ error.message }}
    </ErrorBox>
    <ErrorBox v-else-if="!srcURL">
      The metadata of the NFT does not contain an image.
    </ErrorBox>

    <img
      v-else-if="!isVideo"
      class="object-contain object-center w-full rendering-pixelated rendering-crisp-edges"
      :src="srcURL"
      alt=" "
    />
    <video
      v-else-if="isVideo"
      :src="srcURL"
      loop
      autoplay
      playsinline
      class="object-contain object-center w-full"
    ></video>
  </div>
</template>

<script>
import { getSourceURL, isVideoURL } from "../urls.js";
import ErrorBox from "./ErrorBox.vue";

export default {
  name: "Artwork",
  props: ["metadata", "error"],
  components: {
    ErrorBox,
  },

  computed: {
    srcURL() {
      if (this.metadata) {
        return getSourceURL(this.metadata);
      }
      return null;
    },
    isVideo() {
      if (!this.srcURL) {
        return false;
      }
      return isVideoURL(this.srcURL);
    },
  },
};
</script>
