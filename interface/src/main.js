import Vue from "vue";
import App from "./App.vue";

import { setupFormulate } from "./formulate.js";
import { setupVuex, store } from "./vuex.js";
import { setupRouter, router } from "./router";

import "tailwindcss/tailwind.css";

Vue.config.productionTip = false;
setupFormulate();
setupVuex();
setupRouter();

new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
