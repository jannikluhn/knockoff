<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <h1 class="font-extrabold text-9xl">404</h1>
    <h2 class="font-extrabold text-4xl mb-28">The page was not found</h2>
    <Button :isPrimary="true" message="Go to Main Page" />
  </div>
</template>

<script>
import Button from "../components/Button.vue";

export default {
  name: "NotFound",

  components: {
    Button,
  },
};
</script>
