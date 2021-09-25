<template>
  <div>
    <div class="flex flex-col justify-content-center gap-y-2">
      <div v-if="linkOriginal" class="mx-auto">
        <Button
          :isPrimary="false"
          message="view original"
          @click="$router.push(originalLink)"
        />
      </div>
      <div class="mx-auto">
        <Button :isPrimary="true" message="knock-off" @click="onCreate" />
      </div>
      <div v-if="inProgress" class="pt-8 flex flex-col justify-center">
        <div class="flex justify-center">
          <BeatLoader color="black" />
        </div>
        <div>
          <p class="text-center">{{ message }}</p>
        </div>
      </div>
      <ErrorBox v-if="error">
        {{ formattedError }}
      </ErrorBox>
    </div>
  </div>
</template>

<script>
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import Button from "./Button";
import ErrorBox from "./ErrorBox";
import {
  logError,
  formatErrorWithoutMessage,
  throwError,
  errorCodes,
} from "../errors";
import { chains, chainIDToPathSegment } from "../chains";
import { contractFactories } from "../contracts";
import { waitForKnockOffToken } from "../knockOffFetching";
import ERC721KnockOffsABI from "../assets/ERC721KnockOffsABI.json";

function getMintLogDescriptionFromReceipt(receipt) {
  if (receipt.logs.length != 2) {
    throwError(errorCodes.TX_ERROR, "Transaction emitted unexpected events.");
  }
  const log = receipt.logs[1];

  const iface = new ethers.utils.Interface(ERC721KnockOffsABI);
  const logDescription = iface.parseLog(log);
  return logDescription;
}

export default {
  name: "KnockOffCreator",
  props: ["chainID", "contractAddress", "tokenID", "linkOriginal"],
  components: {
    Button,
    ErrorBox,
    BeatLoader,
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
      if (this.error.obj) {
        if (this.error.obj.code === -32002) {
          return "A request is already in progress. Please check your wallet.";
        }
        if (this.error.obj.code === 4001) {
          return "Transaction signature request denied.";
        }
      }
      return formatErrorWithoutMessage(this.error);
    },
    originalLink() {
      return {
        name: "original",
        params: {
          chain: chainIDToPathSegment(this.chainID),
          contractAddress: ethers.utils.getAddress(this.contractAddress),
          tokenID: ethers.BigNumber.from(this.tokenID).toString(),
        },
      };
    },
  },

  methods: {
    async onCreate() {
      if (this.inProgress) {
        return;
      }

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
      var receipt;
      try {
        receipt = await tx.wait();
      } catch (e) {
        throwError(
          errorCodes.TX_ERROR,
          "error waiting for transaction to be confirmed",
          e
        );
      }

      const log = getMintLogDescriptionFromReceipt(receipt);

      this.message = "Waiting for knock off to be indexed...";
      await waitForKnockOffToken(
        this.chainID,
        contract.address,
        log.args.tokenID
      );

      this.message = "Redirecting to knock off page...";
      this.$router.push({
        name: "knockoff",
        params: {
          chain: chainIDToPathSegment(this.chainID),
          contractAddress: ethers.utils.getAddress(contract.address),
          tokenID: ethers.BigNumber.from(log.args.tokenID).toString(),
        },
      });
    },
  },
};
</script>
