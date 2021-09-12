<template>
  <Gallery :initialNumTokens="3" :showMoreButton="true" />
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
