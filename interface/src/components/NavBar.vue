<template>
  <nav class="bg-white relative z-50 shadow-md">
    <div class="px-4 flex justify-between">
      <router-link
        class="py-4 cursor-pointer uppercase font-bold border-b-2 border-opacity-0"
        :to="{ name: 'landing' }"
      >
        <img src="../assets/Logo.svg" alt="" class="w-56" />
      </router-link>

      <div class="flex justify-right text-sm sm:text-base sm:text-gray-500">
        <router-link
          class="h-full py-4 pl-5 cursor-pointer hover:text-black font-medium"
          :class="walletSelected ? 'text-black' : ''"
          :to="{ name: 'wallet' }"
        >
          Wallet
        </router-link>
        <router-link
          class="h-full py-4 pl-3 cursor-pointer hover:text-black font-medium"
          :class="gallerySelected ? 'text-black' : ''"
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
