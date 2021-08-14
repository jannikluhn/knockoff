import Vue from "vue";
import App from "./App.vue";

import { setupFormulate } from "./formulate.js";
import { setupVuex, store } from "./vuex";

Vue.config.productionTip = false;
setupFormulate();
setupVuex();

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
