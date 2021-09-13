<template>
  <nav class="bg-white shadow-md mb-8">
    <div class="px-4 flex justify-between">
      <router-link
        class="py-4 cursor-pointer border-b-2 border-opacity-0"
        :to="{ name: 'landing' }"
      >
        Beautiful Logo
      </router-link>

      <router-link
        class="py-4 px-4 cursor-pointer hover:border-b-2 border-blue-500"
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
