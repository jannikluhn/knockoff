<template>
  <nav class="bg-white relative z-50 shadow-md">
    <div class="px-4 flex justify-between">
      <router-link
        class="py-4 cursor-pointer uppercase font-bold border-b-2 border-opacity-0"
        :to="{ name: 'landing' }"
      >
        <img src="../assets/logo.png" alt="" class="w-56" />
      </router-link>

      <div class="flex justify-right">
        <router-link
          class="h-full py-4 px-4 cursor-pointer hover:border-b-2 border-black font-medium"
          :class="walletSelected ? 'border-b-2' : ''"
          :to="{ name: 'wallet' }"
        >
          Wallet
        </router-link>
        <router-link
          class="h-full py-4 px-4 cursor-pointer hover:border-b-2 border-black font-medium"
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
