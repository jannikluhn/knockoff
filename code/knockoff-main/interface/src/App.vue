<template>
  <div id="app">
    <NavBar />
    <div class="container mx-auto px-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
