<template>
  <div id="app" class="flex flex-col h-screen justify-between">
    <NavBar />
    <div class="flex-grow mx-auto w-full" :class="backgroundClass">
      <div class="container mx-auto px-2 mt-8 flex-grow">
        <router-view></router-view>
      </div>
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

  computed: {
    backgroundClass() {
      if (this.$route.name == "landing") {
        return "background";
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
.background {
  background-image: url("~@/assets/knockoff-bg.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
</style>
