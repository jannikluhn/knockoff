<template>
  <div class="flex justify-center">
    <ErrorBox v-if="error">
      {{ error.message }}
    </ErrorBox>
    <ErrorBox v-else-if="!srcURL">
      The metadata of the NFT does not contain an image.
    </ErrorBox>

    <img v-else class="object-contain object-center" :src="srcURL" alt=" " />
  </div>
</template>

<script>
import {
  isIpfsUrl,
  getIPFSGatewayURL,
  isArweaveURL,
  getArweaveGatewayURL,
} from "../urls.js";
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
        const image = this.metadata["image"];
        if (!image) {
          return null;
        }
        if (isIpfsUrl(image)) {
          return getIPFSGatewayURL(image);
        }
        if (isArweaveURL(image)) {
          return getArweaveGatewayURL(image);
        }
        return image;
      }
      return null;
    },
  },
};
</script>
