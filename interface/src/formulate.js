import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";
import { isValidAddress, isValidTokenID } from "./validation";

function addressRule(context) {
  return isValidAddress(context.value);
}

function tokenIDRule(context) {
  return isValidTokenID(context.value);
}

function setupFormulate() {
  Vue.use(VueFormulate, {
    rules: {
      address: addressRule,
      tokenID: tokenIDRule,
    },
    locales: {
      en: {
        address: () => {
          return "Please enter a valid Ethereum address.";
        },
        tokenID: () => {
          return "Please enter a valid token ID.";
        },
      },
    },
  });
}

export { setupFormulate };
