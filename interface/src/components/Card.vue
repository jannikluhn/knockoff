<template>
  <router-link
    :to="routerLink"
    tag="div"
    class="w-full aspect-w-4 aspect-h-5 rounded border-2 border-black transform hover:-translate-y-2 hover:shadow cursor-pointer transition"
  >
    <div>
      <div class="w-full aspect-w-1 aspect-h-1">
        <img
          v-if="!isVideo"
          class="w-full h-full overflow-hidden object-cover"
          :src="srcURL"
          alt=" "
        />
        <video
          v-else
          :src="srcURL"
          loop
          autoplay
          playsinline
          class="object-contain object-center"
        ></video>
      </div>
      <div class="w-full aspect-w-4 aspect-h-1 pt-2">
        <div class="px-2 flex flex-col justify-center items-center">
          <div class="overflow-hidden">
            <h2 class="text-center font-bold text-xl mb-0.5 leading-5">
              {{ titleCropped }}
            </h2>
            <p class="text-center">{{ mintDate }}</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { chainIDToPathSegment } from "../chains";
import { formatTimestampAsDate } from "../formatting";
import { isVideoURL, getSourceURL } from "../urls";

const maxTitleLength = 40;

export default {
  name: "Card",
  props: ["token", "metadata"],

  computed: {
    title() {
      if (this.metadata && this.metadata["name"]) {
        return this.metadata["name"];
      }
      return "Unknown Title";
    },
    titleCropped() {
      if (this.title.length <= maxTitleLength) {
        return this.title;
      }
      return this.title.substring(0, maxTitleLength - 3) + "...";
    },
    mintDate() {
      return formatTimestampAsDate(this.token.mintTimestamp);
    },
    srcURL() {
      if (this.metadata && this.metadata["image"]) {
        return getSourceURL(this.metadata);
      }
      return "";
    },
    isVideo() {
      if (!this.srcURL) {
        return isVideoURL(this.srcURL);
      }
      return this.srcURL.endsWith(".mp4");
    },
    routerLink() {
      return {
        name: "knockoff",
        params: {
          chain: chainIDToPathSegment(this.token.contract.chainID),
          contractAddress: this.token.contract.address,
          tokenID: this.token.tokenID.toString(),
        },
      };
    },
  },

  methods: {
    onClick() {
      this.$router.push();
    },
  },
};
</script>
