import Vue from "vue";
import VueRouter from "vue-router";

import LandingPage from "./pages/LandingPage.vue";
import GalleryPage from "./pages/GalleryPage.vue";
import OriginalPage from "./pages/OriginalPage.vue";
import KnockoffPage from "./pages/KnockoffPage.vue";

function setupRouter() {
  Vue.use(VueRouter);
}

const routes = [
  {
    path: "/",
    component: LandingPage,
  },
  {
    path: "/gallery",
    component: GalleryPage,
  },
  {
    path: "/original",
    component: OriginalPage,
  },
  {
    path: "/knockoff",
    component: KnockoffPage,
  },
];

const router = new VueRouter({
  routes,
});

export { setupRouter, router, routes };
