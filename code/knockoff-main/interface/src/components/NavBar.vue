<template>
  <nav class="bg-white mb-8 relative z-50">
    <div class="px-4 flex justify-between">
      <router-link
        class="py-4 cursor-pointer uppercase font-bold border-b-2 border-opacity-0"
        :to="{ name: 'landing' }"
      >
        <img src="../assets/LOGO.png" alt="" class="w-56">
      </router-link>

      <router-link
        class="py-4 px-4 cursor-pointer font-medium"
        :to="{ name: 'gallery' }"
      >
        Gallery
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>
