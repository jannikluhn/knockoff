<template>
  <div id="app" class="flex flex-col h-screen justify-between">
    <NavBar />
    <div class="container mx-auto px-2 flex-grow">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    NavBar,
    Footer,
  },

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
