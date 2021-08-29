<template>
  <router-link :to="routerLink">
    <div
      class="w-full my-4 rounded overflow-hidden border-2 border-black transform hover:-translate-y-0.5"
    >
      <img
        class="w-full h-64 object-cover object-center"
        :src="srcURL"
        alt="NFT Artwork"
      />
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="">
          <h2 class="font-extrabold italic uppercase text-xl mb-0.5 leading-5">
            {{ title }}
          </h2>
          <p class="font-medium text-sm">
            {{ mintDate }}
          </p>
        </div>
        <div class="font-semi-bold italic text-3xl">
          # {{ token.serialNumber }}
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import { chainIDToPathSegment } from "../chains";
import { formatTimestampAsDate } from "../formatting";

export default {
  name: "Card",
  props: ["token", "metadata"],

  computed: {
    title() {
      if (this.metadata && this.metadata["name"]) {
        return this.metadata["name"];
      }
      return "Unknown title";
    },
    mintDate() {
      return formatTimestampAsDate(this.token.mintTimestamp);
    },
    srcURL() {
      if (this.metadata && this.metadata["image"]) {
        return this.metadata["image"];
      }
      return "";
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
