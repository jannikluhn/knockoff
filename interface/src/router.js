import Vue from "vue";
import VueRouter from "vue-router";

import LandingPage from "./pages/LandingPage.vue";
import GalleryPage from "./pages/GalleryPage.vue";
import OriginalPage from "./pages/OriginalPage.vue";
import KnockoffPage from "./pages/KnockoffPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

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
    path: "/original/:chain/:contractAddress/:tokenID",
    component: OriginalPage,
    props: true,
  },
  {
    path: "/knockoff/:chain/:contractAddress/:tokenID",
    component: KnockoffPage,
    props: true,
  },
  {
    path: "*",
    component: NotFoundPage,
  },
];

const router = new VueRouter({
  routes,
});

export { setupRouter, router, routes };
