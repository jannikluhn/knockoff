import Vue from "vue";
import "vue-awesome/icons";

import Icon from "vue-awesome/components/Icon";

export function setupIcons() {
  Vue.component("v-icon", Icon);
}
