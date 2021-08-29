<template>
  <Gallery :maxTokens="10" />
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
