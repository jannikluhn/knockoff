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
    name: "landing",
    path: "/",
    component: LandingPage,
  },
  {
    name: "gallery",
    path: "/gallery",
    component: GalleryPage,
  },
  {
    name: "original",
    path: "/original/:chain/:contractAddress/:tokenID",
    component: OriginalPage,
    props: true,
  },
  {
    name: "knockoff",
    path: "/knockoff/:chain/:contractAddress/:tokenID",
    component: KnockoffPage,
    props: true,
  },
  {
    name: "notfound",
    path: "*",
    component: NotFoundPage,
  },
];

const router = new VueRouter({
  routes,
});

export { setupRouter, router, routes };
