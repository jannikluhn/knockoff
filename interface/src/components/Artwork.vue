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
import {
  isIpfsUrl,
  getIPFSGatewayURL,
  isArweaveURL,
  getArweaveGatewayURL,
} from "../urls.js";

export default {
  name: "Artwork",
  props: ["metadata", "error"],

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
