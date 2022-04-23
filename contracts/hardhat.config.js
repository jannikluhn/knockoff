require("dotenv").config();

const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");

task("deploy").setAction(async () => {
  const factory = await ethers.getContractFactory("ERC721KnockOffs");
  const c = await factory.deploy();

  const deployTransactionPrint = { ...c.deployTransaction };
  deployTransactionPrint.data = "<removed>";
  console.log("Deploy tx:", deployTransactionPrint);

  const receipt = await c.deployTransaction.wait();
  console.log("Receipt:", receipt);
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",

    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
      chainId: 4,
      accounts: [process.env.DEPLOY_KEY_RINKEBY],
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
      chainId: 5,
      accounts: [process.env.DEPLOY_KEY_GOERLI],
    },
    arbitrumRinkeby: {
      url: "https://rinkeby.arbitrum.io/rpc",
      chainId: 421611,
      accounts: [process.env.DEPLOY_KEY_ARBITRUM_RINKEBY],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: [process.env.DEPLOY_KEY_ARBITRUM],
    },
  },
};
