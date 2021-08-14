import Vue from "vue";
import VueFormulate from "@braid/vue-formulate";
import { ethers } from "ethers";

const MAX_TOKEN_ID =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

function addressRule(context) {
  try {
    ethers.utils.getAddress(context.value);
  } catch (e) {
    return false;
  }
  return true;
}

function tokenIDRule(context) {
  let tokenID;
  try {
    tokenID = ethers.BigNumber.from(context.value);
  } catch (e) {
    return false;
  }
  return tokenID.gte(0) && tokenID.lte(MAX_TOKEN_ID);
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
          return "Please enter a valid Ethereum address";
        },
        tokenID: () => {
          return "Please enter a valid token id";
        },
      },
    },
  });
}

export { setupFormulate };
