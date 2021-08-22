import Vue from "vue";
import App from "./App.vue";

import { setupFormulate } from "./formulate.js";
import { setupRouter, router } from "./router";

import "tailwindcss/tailwind.css";

Vue.config.productionTip = false;
setupFormulate();
setupRouter();

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
