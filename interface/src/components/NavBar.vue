<template>
  <nav class="bg-white shadow-md mb-8">
    <div class="px-4 flex justify-between">
      <router-link
        class="py-4 cursor-pointer border-b-2 border-opacity-0"
        :to="{ name: 'landing' }"
      >
        Beautiful Logo
      </router-link>

      <div class="flex justify-right">
        <router-link
          class="h-full py-4 px-4 cursor-pointer hover:border-b-2 border-blue-500"
          :class="walletSelected ? 'border-b-2' : ''"
          :to="{ name: 'wallet' }"
        >
          Wallet
        </router-link>
        <router-link
          class="h-full py-4 px-4 cursor-pointer hover:border-b-2 border-blue-500"
          :class="gallerySelected ? 'border-b-2' : ''"
          :to="{ name: 'gallery' }"
        >
          Gallery
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  computed: {
    walletSelected() {
      return this.$route.name == "wallet";
    },
    gallerySelected() {
      return this.$route.name == "gallery";
    },
  },
};
</script>
