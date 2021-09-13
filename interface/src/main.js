import Vue from "vue";
import App from "./App.vue";

import { setupFormulate } from "./formulate.js";
import { setupRouter, router } from "./router";
import { setupIcons } from "./icons";

import "tailwindcss/tailwind.css";

Vue.config.productionTip = false;

setupFormulate();
setupRouter();
setupIcons();

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
