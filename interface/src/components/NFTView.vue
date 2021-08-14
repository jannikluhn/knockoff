<template>
  <div v-if="nftTokenState">
    <!-- <p>Contract address: {{ nft.contract.address }}</p> -->
    <p>Owner: {{ nftTokenState.owner }}</p>
    <p>URI: {{ nftTokenState.erc721URI }}</p>
    <p>{{ nftTokenState }}</p>
    <img v-if="json" :src="json.image" />
  </div>
</template>

<script>
export default {
  name: "NFTView",
  props: ["nftTokenLocationID"],

  data() {
    return {
      json: null,
    };
  },

  computed: {
    nftTokenState() {
      if (!this.nftTokenLocationID) {
        return null;
      }
      return this.$store.getters.joinedNFTTokenState(this.nftTokenLocationID);
    },
  },

  watch: {
    async nftTokenLocationID() {
      if (!this.nftTokenLocationID) {
        this.json = null;
        return;
      }
      if (!this.$store.state.erc721JSONs[this.nftTokenLocationID]) {
        try {
          await this.$store.dispatch(
            "fetchERC721JSON",
            this.nftTokenLocationID
          );
        } catch (e) {
          console.error(e);
          this.json = null;
          return;
        }
      }
      this.json = this.$store.state.erc721JSONs[this.nftTokenLocationID];
    },
  },
};
</script>
