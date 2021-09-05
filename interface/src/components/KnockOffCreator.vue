<template>
  <div>
    <Button :isPrimary="true" message="knock-off" @click="onCreate" />
    <p v-if="inProgress">{{ message }}</p>
    <p v-if="error">{{ formattedError }}</p>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import Button from "./Button";
import {
  logError,
  formatErrorWithoutMessage,
  throwError,
  errorCodes,
} from "../errors";
import { chains } from "../chains";
import { contractFactories } from "../contracts";

export default {
  name: "KnockOffCreator",
  props: ["chainID", "contractAddress", "tokenID"],
  components: {
    Button,
  },
  data() {
    return {
      inProgress: false,
      error: null,
      message: null,
    };
  },
  computed: {
    chainIDHex() {
      return "0x" + this.chainID.toString(16);
    },
    formattedError() {
      if (!this.error) {
        return null;
      }
      return formatErrorWithoutMessage(this.error);
    },
  },

  methods: {
    async onCreate() {
      this.inProgress = true;
      this.error = null;
      this.message = null;

      try {
        const provider = await this.detectProvider();
        await this.changeNetwork(provider);
        const address = await this.requestAccounts(provider);
        await this.sendTransaction(provider, address);
      } catch (e) {
        logError("error creating knock off", e);
        this.error = e;
      } finally {
        this.inProgress = false;
      }
    },

    async detectProvider() {
      this.message = "Detecting Ethereum provider...";
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

    async changeNetwork(provider) {
      const chain = chains[this.chainID];
      this.message = "Switching to " + chain.name + "...";
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: this.chainIDHex }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          this.message = chain.name + " not registered in wallet, adding it...";
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: this.chainIDHex,
                  rpcUrls: [chain.providerURL],
                  chainName: chain.name,
                  nativeCurrency: chain.nativeCurrency,
                  blockExplorerUrls: chain.blockExplorerUrls,
                },
              ],
            });
          } catch (addError) {
            throwError(
              errorCodes.TX_ERROR,
              "failed to register " +
                chain.name +
                " as a network in your wallet",
              addError
            );
          }
        } else {
          throwError(
            errorCodes.TX_ERROR,
            "failed to switch wallet to " + chain.name,
            switchError
          );
        }
      }
    },

    async requestAccounts(provider) {
      this.message = "Requesting account access...";
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

    async sendTransaction(provider, address) {
      this.message = "Preparing transaction...";

      const chain = chains[this.chainID];
      const attachedContract = contractFactories["ERC721KnockOffs"].attach(
        chain.erc721KnockOffsAddress
      );

      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const contract = attachedContract.connect(signer);

      this.message = "Waiting for user to confirm signature...";
      let tx;
      try {
        tx = await contract.mint(address, this.contractAddress, this.tokenID);
      } catch (e) {
        throwError(
          errorCodes.TX_ERROR,
          "failed to prepare Ethereum transaction",
          e
        );
      }

      this.message = "Waiting for first transaction confirmation...";
      try {
        await tx.wait();
      } catch (e) {
        throwError(
          errorCodes.TX_ERROR,
          "error waiting for transaction to be confirmed",
          e
        );
      }
      this.message = "Transaction confirmed";
    },
  },
};
</script>
