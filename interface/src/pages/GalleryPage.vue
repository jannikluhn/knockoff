<template>
  <Gallery :initialNumTokens="8" :showMoreButton="true" :owner="null" />
</template>

<script>
import Gallery from "../components/Gallery.vue";

export default {
  name: "GalleryPage",
  components: {
    Gallery,
  },
};
</script>
