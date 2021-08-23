<template>
  <div id="app" class="items-center px-5 sm:px-20 md:px-40">
    <router-link to="/">Landing</router-link>
    <router-link to="/gallery">Gallery</router-link>
    <router-link to="/original/ethereum/0xaabbcc/123">Original</router-link>
    <router-link to="/knockoff/ethereum/0xffeedd/321">Knock Off</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},

  data() {
    return {
      nftTokenLocationID: null,
    };
  },
};
</script>
