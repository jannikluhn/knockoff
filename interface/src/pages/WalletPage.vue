<template>
  <div>
    <div v-if="!account" class="flex flex-col items-center">
      <div class="mt-8 mx-auto">
        <div class="flex flex-col items-center mb-6">
          <Button
            :isPrimary="true"
            message="Connect to Wallet"
            @click="connect"
          />
        </div>
        <div v-if="connecting" class="flex justify-center mb-6">
          <BeatLoader color="black" />
        </div>
        <ErrorBox v-if="error">
          {{ formattedError }}
        </ErrorBox>
      </div>
    </div>
    <Gallery
      v-else
      :initialNumTokens="5"
      :showMoreButton="true"
      :owner="account"
    />
  </div>
</template>

<script>
import Gallery from "../components/Gallery.vue";
import Button from "../components/Button.vue";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import ErrorBox from "../components/ErrorBox.vue";
import detectEthereumProvider from "@metamask/detect-provider";

import {
  logError,
  formatErrorWithoutMessage,
  throwError,
  errorCodes,
} from "../errors";

export default {
  name: "WalletPage",
  components: {
    Button,
    Gallery,
    BeatLoader,
    ErrorBox,
  },

  data() {
    return {
      connecting: false,
      account: null,
      error: null,
    };
  },

  computed: {
    formattedError() {
      if (!this.error) {
        return null;
      }
      if (this.error.obj) {
        if (this.error.obj.code === -32002) {
          return "A request is already in progress. Please check your wallet.";
        }
      }
      return formatErrorWithoutMessage(this.error);
    },
  },

  methods: {
    async connect() {
      if (this.connecting) {
        return;
      }
      this.connecting = true;
      this.error = null;
      this.account = null;

      try {
        const provider = await this.detectProvider();
        this.account = await this.requestAccounts(provider);
      } catch (e) {
        logError("error connecting wallet", e);
        this.error = e;
      } finally {
        this.connecting = false;
      }
    },

    async detectProvider() {
      const provider = await detectEthereumProvider({
        timeout: 1000,
        silent: true,
      });
      if (!provider) {
        throwError(
          errorCodes.TX_ERROR,
          "No Ethereum provider found. Please install a browser wallet such as Metamask.",
          null
        );
      }
      return provider;
    },

    async requestAccounts(provider) {
      try {
        const addresses = await provider.request({
          method: "eth_requestAccounts",
          params: [],
        });
        return addresses[0];
      } catch (e) {
        throwError(errorCodes.TX_ERROR, "failed to get account access", e);
      }
    },
  },
};
</script>
