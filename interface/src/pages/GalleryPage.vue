<template>
  <div
    class="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 justify-items-center"
  >
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
  </div>
</template>

<script>
import Card from "../components/Card.vue";

export default {
  name: "GalleryPage",
  components: {
    Card,
  },
};
</script>
